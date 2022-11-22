FROM python:3.8
WORKDIR /mlapp/classification
COPY requirements.txt .
#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN ls
CMD [ "python3", "api.py" ]