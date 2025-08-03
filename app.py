import os
from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import joblib
import numpy as np
# accuracy score import
from sklearn.metrics import accuracy_score

# instance of Flask
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key_here')

# file paths
MODEL_PATH = 'model.pkl'
REAL_TIME_PREDICTIONS_PATH = 'data/real_time_predictions.csv'
BATCH_PREDICTIONS_PATH = 'data/batch_predictions.csv'
ONLINE_DATA_PATH = 'data/online_data.csv'


REQUIRED_FEATURES = ['Pregnancies', "Glucose", "BloodPressure","SkinThickness","Insulin","BMI","DiabetesPedigreeFunction","Age"]


def fetch_and_save_data():
    '''Fetch the dataset from an online API'''
    url = f'https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv'
    columns = REQUIRED_FEATURES + ['Outcome']
    data = pd.read_csv(url, header=None, names=columns)
    os.makedirs("data", exist_ok=True)
    
    # save the data to a csv file
    data.to_csv(ONLINE_DATA_PATH, index=False)

    print("Dataset downloaded and saved into data folder")
    return data

# Function to train and save the model
def train_and_save_model():
    '''Training the model and save it to a file'''
    if not os.path.exists(ONLINE_DATA_PATH):
        data = fetch_and_save_data()
    else:
        data = pd.read_csv(ONLINE_DATA_PATH)
    
    X = data.drop(columns=['Outcome'])
    y = data['Outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.4f}")

    # Save the model
    joblib.dump(model, MODEL_PATH)
    print(f"Model is saved to {MODEL_PATH}")

# Function to load the trained model
def load_model():
    '''Load the trained model'''
    if not os.path.exists(MODEL_PATH):
        print("Model not found. Training a new model!!!")
        train_and_save_model()
    return joblib.load(MODEL_PATH)

model = load_model()

# Initialize model - but handle gracefully for Vercel
try:
    model = load_model()
except Exception as e:
    print(f"Failed to initialize model: {e}")
    model = None

# Function to validate input data for missing features
def validate_input(data, required_features):
    '''Validate input data for missing features'''
    missing_features = [feature for feature in required_features if feature not in data]
    if missing_features:
        raise ValueError(f"Missing feature(s): {', '.join(missing_features)}")
    # If no missing features, return the validated data
    return data

@app.route('/predict', methods=['POST'])
def predict():
    '''Real-time prediction endpoint for a specific use case'''
    try:
        data = request.get_json()
        validate_input(data, REQUIRED_FEATURES)
        
        # Convert input into array
        input_data = np.array([data[feature] for feature in REQUIRED_FEATURES]).reshape(1, -1)
        # reshape is used to convert the input into a 2D array with one row and multiple columns (1, -1 means one row and as many columns as needed)
        
        # Make prediction
        prediction = model.predict(input_data)
        
        # Save this prediction into a file
        record = {**data, "Prediction": int(prediction[0])}
        
        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)
        
        # Append the record to the real-time predictions CSV file
        pd.DataFrame([record]).to_csv(REAL_TIME_PREDICTIONS_PATH, mode='a', header=not os.path.exists(REAL_TIME_PREDICTIONS_PATH), index=False)
        
        return jsonify(record), 200
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    '''Batch prediction endpoint'''
    try:
        # Check if file is provided
        if 'file' not in request.files:
            return jsonify({'error': 'No files uploaded by user'}), 400
        
        file = request.files['file']
        batch_data = pd.read_csv(file)
        
        # Validating input data
        validate_input(batch_data.columns, REQUIRED_FEATURES)
        
        # Make predictions for the batch data
        predictions = model.predict(batch_data[REQUIRED_FEATURES])
        
        # Save predictions to a DataFrame
        batch_data['Prediction'] = predictions
        
        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)
        
        # Save the batch predictions to a CSV file
        batch_data.to_csv(BATCH_PREDICTIONS_PATH, index=False)
        
        return jsonify(batch_data.to_dict(orient='records')), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/')
def index():
    '''Home route'''
    return render_template('index.html')

@app.route('/predict-form')
def predict_form():
    '''Single prediction form page'''
    return render_template('predict_form.html')

@app.route('/batch-form')
def batch_form():
    '''Batch prediction form page'''
    return render_template('batch_form.html')

@app.route('/results')
def results():
    '''Results page'''
    return render_template('results.html')

@app.route('/about')
def about():
    '''About page'''
    return render_template('about.html')

@app.route('/submit-prediction', methods=['POST'])
def submit_prediction():
    '''Handle form submission for single prediction'''
    try:
        # Get form data
        data = {}
        for feature in REQUIRED_FEATURES:
            value = request.form.get(feature)
            if value:
                data[feature] = float(value)
            else:
                flash(f'Please provide a value for {feature}', 'error')
                return redirect(url_for('predict_form'))
        
        validate_input(data, REQUIRED_FEATURES)
        
        # Convert input into array
        input_data = np.array([data[feature] for feature in REQUIRED_FEATURES]).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(input_data)
        probability = model.predict_proba(input_data)[0]
        
        # Save this prediction into a file
        record = {**data, "Prediction": int(prediction[0])}
        
        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)
        
        # Append the record to the real-time predictions CSV file
        pd.DataFrame([record]).to_csv(REAL_TIME_PREDICTIONS_PATH, mode='a', header=not os.path.exists(REAL_TIME_PREDICTIONS_PATH), index=False)
        
        result = {
            'prediction': int(prediction[0]),
            'probability_no_diabetes': f"{probability[0]:.2%}",
            'probability_diabetes': f"{probability[1]:.2%}",
            'input_data': data
        }
        
        return render_template('result.html', result=result)
        
    except Exception as e:
        flash(f'Error: {str(e)}', 'error')
        return redirect(url_for('predict_form'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

