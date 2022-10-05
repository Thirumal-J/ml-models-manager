#!/usr/bin/env sh
source "MLflowTrial/mlflow-env/bin/activate"
cd Backend

# Set environment variable for the tracking URL where the Model Registry resides
export MLFLOW_TRACKING_URI=http://localhost:5001

# Serve the production model from the model registry
mlflow models serve -m "models:/sk-learn-random-forest-reg-model/Production"
