FROM python:3.11-slim
WORKDIR /app
COPY requirements-hf.txt .
RUN pip install --no-cache-dir -r requirements-hf.txt
COPY forecast_models.py forecast_graph.py forecast_pdf.py forecast_api.py hf_app.py ./
EXPOSE 7860
CMD ["uvicorn", "hf_app:app", "--host", "0.0.0.0", "--port", "7860"]
