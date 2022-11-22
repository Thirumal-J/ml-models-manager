FROM python:3.8.10
#Install git
RUN apt-get update  
COPY ./requirements.txt /Backend/src/pipelines/classification/requirements.txt
WORKDIR /classification
RUN pip install -r requirements.txt
COPY . /classification
ENTRYPOINT [ "python3" ]
CMD [ "src/pipelines/classification/api.py" ]