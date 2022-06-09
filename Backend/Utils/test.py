import numpy as np
import pandas as pd
# from imblearn.combine import SMOTEENN
# from imblearn.over_sampling import SMOTE
# from imblearn.under_sampling import EditedNearestNeighbours
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.decomposition import PCA
# from sklearn.impute import SimpleImputer
# from sklearn.utils import shuffle
# from sklearn.model_selection import train_test_split

train_data = pd.read_csv("C:/Thiru workspace/Fraunhofer IPT/WS/Backend/Datasets/aps_failure_training_set.csv", na_values=["na"])
test_data = pd.read_csv("C:/Thiru workspace/Fraunhofer IPT/WS/Backend/Datasets/aps_failure_test_set.csv", na_values=["na"])

raw_data = pd.concat(objs=[train_data, test_data], axis=0)

raw_data.to_csv('scania_dataset.csv')
