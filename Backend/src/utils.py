import os
import config as appConf


def getParentDirectory(currentDirectory=os.getcwd()):
    return os.path.abspath(os.path.join(currentDirectory, os.pardir))


def isPathExist(inputPath):
    print(f"-- {inputPath} - is directory exist --> {os.path.exists(inputPath)}")
    return os.path.exists(inputPath)


def getModelRegistryAbsPath(currentDirectory = os.getcwd()):
    return getParentDirectory(currentDirectory) + appConf.ML_MODEL_REGISTRY_LOCATION


def getMLRunsAbsPath(currentDirectory = os.getcwd()):
    return getParentDirectory(currentDirectory) + appConf.MLFLOW_RUNS_LOCATION
