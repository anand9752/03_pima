d# Pima Diabetes Prediction System

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.1.1-green.svg)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.7.1-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🚀 Project Overview

The **Pima Diabetes Prediction System** is a comprehensive machine learning web application that predicts diabetes risk using the famous Pima Indians Diabetes dataset. This Flask-based application provides both individual and batch prediction capabilities with an intuitive web interface.

### 🎯 Key Features

- **Real-time Predictions**: Get instant diabetes risk predictions for individual patients
- **Batch Processing**: Upload CSV files for bulk predictions
- **Interactive Web Interface**: User-friendly forms and result visualization
- **Data Persistence**: Automatic storage of predictions for future analysis
- **Model Training**: Automatic model training and retraining capabilities
- **RESTful API**: JSON endpoints for integration with other systems

## 📊 Dataset Information

The application uses the **Pima Indians Diabetes Dataset** which contains medical data for diabetes prediction:

### Input Features (8 parameters):
1. **Pregnancies**: Number of times pregnant
2. **Glucose**: Plasma glucose concentration (2 hours in an oral glucose tolerance test)
3. **BloodPressure**: Diastolic blood pressure (mm Hg)
4. **SkinThickness**: Triceps skin fold thickness (mm)
5. **Insulin**: 2-Hour serum insulin (mu U/ml)
6. **BMI**: Body mass index (weight in kg/(height in m)^2)
7. **DiabetesPedigreeFunction**: Diabetes pedigree function (genetic factor)
8. **Age**: Age in years

### Output:
- **Outcome**: Binary classification (0 = No Diabetes, 1 = Diabetes)

## 🏗️ Architecture

### System Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │────│   Flask Server  │────│  ML Model (RF)  │
│                 │    │                 │    │                 │
│ - HTML Forms    │    │ - Route Handler │    │ - Random Forest │
│ - JavaScript    │    │ - Data Validation│    │ - Scikit-learn  │
│ - CSS Styling   │    │ - JSON API      │    │ - Joblib        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   Templates     │    │   Data Storage  │
│                 │    │                 │    │                 │
│ - CSS/JS Files  │    │ - Jinja2 HTML   │    │ - model.pkl     │
│ - Bootstrap     │    │ - Form Templates│    │ - CSV Files     │
│ - Font Awesome  │    │ - Result Views  │    │ - Predictions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Backend
- **Python 3.8+**: Core programming language
- **Flask 3.1.1**: Web framework for API and web interface
- **Scikit-learn 1.7.1**: Machine learning library
- **Pandas 2.3.1**: Data manipulation and analysis
- **NumPy 2.3.2**: Numerical computing
- **Joblib 1.5.1**: Model serialization

#### Frontend
- **HTML5 & CSS3**: Structure and styling
- **Bootstrap 5**: Responsive UI framework
- **JavaScript**: Client-side interactions
- **Jinja2**: Template engine
- **Font Awesome**: Icons

#### Machine Learning
- **Random Forest Classifier**: Primary prediction model
- **Train-Test Split**: 80-20 split for model validation
- **Cross-validation**: Model performance evaluation

## 📁 Project Structure

```
03_pima/
├── app.py                     # Main Flask application
├── model.pkl                  # Trained ML model (auto-generated)
├── requirement.txt            # Python dependencies
├── README.md                  # Project documentation
│
├── data/                      # Data directory
│   ├── online_data.csv        # Downloaded dataset
│   ├── real_time_predictions.csv  # Single predictions log
│   └── batch_predictions.csv  # Batch predictions log
│
├── static/                    # Static web assets
│   ├── css/
│   │   └── style.css         # Custom CSS styles
│   └── js/
│       └── main.js           # JavaScript functionality
│
└── templates/                 # HTML templates
    ├── base.html             # Base template with layout
    ├── index.html            # Homepage
    ├── predict_form.html     # Single prediction form
    ├── batch_form.html       # Batch prediction form
    ├── result.html           # Single prediction results
    ├── results.html          # Results page
    └── about.html            # About page
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd 03_pima
```

### Step 2: Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv diabetes_env
diabetes_env\Scripts\activate

# macOS/Linux
python3 -m venv diabetes_env
source diabetes_env/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirement.txt
```

### Step 4: Run the Application
```bash
python app.py
```

The application will be available at: `http://localhost:5000`

## 🎮 Usage Guide

### Web Interface

#### 1. Single Prediction
1. Navigate to the homepage (`http://localhost:5000`)
2. Click "Single Prediction"
3. Fill in all 8 medical parameters
4. Submit to get instant prediction with probability scores

#### 2. Batch Prediction
1. Click "Batch Prediction" on homepage
2. Upload a CSV file with required columns:
   ```csv
   Pregnancies,Glucose,BloodPressure,SkinThickness,Insulin,BMI,DiabetesPedigreeFunction,Age
   6,148,72,35,0,33.6,0.627,50
   1,85,66,29,0,26.6,0.351,31
   ```
3. Download results with predictions added

### API Endpoints

#### Real-time Prediction API
```bash
POST /predict
Content-Type: application/json

{
    "Pregnancies": 6,
    "Glucose": 148,
    "BloodPressure": 72,
    "SkinThickness": 35,
    "Insulin": 0,
    "BMI": 33.6,
    "DiabetesPedigreeFunction": 0.627,
    "Age": 50
}
```

#### Batch Prediction API
```bash
POST /batch-predict
Content-Type: multipart/form-data

file: [CSV file with required columns]
```

## 🤖 Machine Learning Model

### Algorithm: Random Forest Classifier
- **Estimators**: 100 trees
- **Random State**: 42 (for reproducibility)
- **Train-Test Split**: 80% training, 20% testing
- **Performance Metrics**: Accuracy score displayed during training

### Model Features
- **Automatic Training**: Model trains automatically if not found
- **Data Validation**: Input validation for all required features
- **Persistence**: Model saved using Joblib for fast loading
- **Online Data Fetching**: Automatically downloads dataset from GitHub

### Data Pipeline
1. **Data Acquisition**: Downloads Pima Indians dataset from online source
2. **Preprocessing**: Basic data validation and feature extraction
3. **Training**: Random Forest model training with cross-validation
4. **Evaluation**: Accuracy calculation on test set
5. **Persistence**: Model serialization for production use

## 🔍 Key Functions

### Core Functions
- `fetch_and_save_data()`: Downloads and saves dataset
- `train_and_save_model()`: Trains and persists ML model
- `load_model()`: Loads trained model from disk
- `validate_input()`: Validates input data completeness

### Flask Routes
- `/` - Homepage with navigation
- `/predict-form` - Single prediction form
- `/batch-form` - Batch upload form
- `/predict` - API endpoint for real-time predictions
- `/batch-predict` - API endpoint for batch predictions
- `/results` - View stored predictions
- `/about` - Project information

## 🎨 UI Features

- **Responsive Design**: Bootstrap-based responsive layout
- **Modern Interface**: Gradient backgrounds and intuitive navigation
- **Form Validation**: Client and server-side validation
- **Progress Indicators**: Visual feedback for file uploads
- **Error Handling**: User-friendly error messages
- **Result Visualization**: Clear prediction results with probabilities

## 📈 Model Performance

The Random Forest model provides:
- **High Accuracy**: Typically 75-80% accuracy on test data
- **Probability Scores**: Confidence levels for predictions
- **Feature Importance**: Insights into which factors matter most
- **Robust Predictions**: Handles missing data gracefully

## 🔒 Data Privacy & Security

- **Local Processing**: All predictions processed locally
- **No External API**: No data sent to third-party services
- **Session Security**: Flask secret key for session management
- **Input Validation**: Comprehensive data validation and sanitization

## 🚀 Deployment Options

### Local Development
```bash
python app.py
```

### Vercel Deployment

#### Prerequisites
- Node.js and npm installed
- Vercel CLI installed: `npm i -g vercel`
- Git repository

#### Step-by-Step Deployment

1. **Initialize Git Repository** (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Install Vercel CLI**
```bash
npm i -g vercel
```

3. **Login to Vercel**
```bash
vercel login
```

4. **Deploy to Vercel**
```bash
vercel
```

5. **Production Deployment**
```bash
vercel --prod
```

#### Vercel Configuration Files
- `vercel.json`: Vercel deployment configuration
- `index.py`: Entry point for Vercel
- `requirements.txt`: Python dependencies
- `.env`: Environment variables

#### Environment Variables (Set in Vercel Dashboard)
- `SECRET_KEY`: Flask secret key for sessions
- `FLASK_ENV`: Set to "production"

### Other Deployment Options
- **Docker**: Containerize with Dockerfile
- **Heroku**: Deploy with Procfile
- **AWS/GCP/Azure**: Cloud platform deployment
- **WSGI Servers**: Use Gunicorn or uWSGI for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pima Indians Diabetes Dataset**: National Institute of Diabetes and Digestive and Kidney Diseases
- **UCI Machine Learning Repository**: For dataset hosting
- **Scikit-learn Community**: For excellent ML library
- **Flask Community**: For the robust web framework

## 📧 Contact

For questions, suggestions, or issues, please open an issue on GitHub or contact the project maintainer.

---

**Note**: This is an educational project designed to demonstrate machine learning integration with web applications. For actual medical diagnosis, always consult healthcare professionals.
