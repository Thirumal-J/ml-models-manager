FROM python:3.8
ARG CACHEBUST=1
RUN echo "$CACHEBUST"
WORKDIR /mlapp
COPY . .
# COPY core/. .
WORKDIR /mlapp/core
#ADD /config.py .
RUN pip3 install --upgrade pip
RUN pip install -r requirements.txt
CMD [ "python", "-u", "api.py" ]