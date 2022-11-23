FROM python:3.8
WORKDIR /mlapp/core
COPY core/. .
ADD /config.py .
RUN pip install -r requirements.txt
CMD [ "python3", "api.py" ]