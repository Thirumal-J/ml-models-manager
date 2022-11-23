FROM python:3.8
ARG CACHEBUST=1
RUN echo "$CACHEBUST"
WORKDIR /mlapp/classification
ADD pipelines/classification/. .
ADD /config.py .
RUN pip install -r requirements.txt
CMD [ "./wait-for-it.sh", "http://core:5000", "--" "python3", "-u", "api.py" ]