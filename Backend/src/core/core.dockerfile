FROM python:3.8
ARG CACHEBUST=1
RUN echo "$CACHEBUST"
WORKDIR /mlapp/core
COPY core/. .
ADD /config.py .
RUN pip install -r requirements.txt
CMD [ "python3", "-u", "api.py" ]