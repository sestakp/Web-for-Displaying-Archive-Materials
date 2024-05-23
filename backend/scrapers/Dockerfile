# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

RUN playwright install
RUN playwright install-deps
# Copy the current directory contents into the container at /app
COPY . /app

# Install cron
RUN apt-get update && apt-get -y install cron

RUN chmod +x /app/run_spiders.sh

# Add crontab entry to schedule the script to run monthly
RUN echo '0 0 1 * * /app/run_spiders.sh >> /var/log/scrapy.log 2>&1' > /etc/cron.d/scrapy_cronjob

# Give execution permission to the crontab entry
RUN chmod 0644 /etc/cron.d/scrapy_cronjob && \
    crontab /etc/cron.d/scrapy_cronjob

# Run cron in the foreground to keep the container running
CMD ["cron", "-f"]

# Create a cron job file
#COPY cronjob.txt /etc/cron.d/cronjob

# Give execution permission to the cron job file
#RUN chmod 0644 /etc/cron.d/cronjob && \
#    crontab /etc/cron.d/cronjob

# Run cron in the foreground to keep the container running


# Create a script to run commands
#RUN echo "cd /app && scrapy crawl mza_census" > /app/run.sh
#RUN chmod +x /app/run.sh

# Start the script to run the commands
#CMD ["/app/run.sh"]

#CMD ["sleep", "1d"]