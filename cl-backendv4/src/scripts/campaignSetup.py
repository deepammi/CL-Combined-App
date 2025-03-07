import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import sys

# Load environment variables
env_path = '../../.env'  # Adjust path if needed
load_dotenv(dotenv_path=env_path)

def setup_campaign(uploaded_file_path):
    # Load environment variables
    postgres_user = os.environ.get("POSTGRESQL_USER")
    postgres_psswd = os.environ.get("POSTGRESQL_PASSWORD")
    postgres_host = os.environ.get("POSTGRESQL_HOST")
    postgres_db = os.environ.get("POSTGRESQL_DATABASE")

    # Connect to PostgreSQL
    engine = create_engine(f'postgresql://{postgres_user}:{postgres_psswd}@{postgres_host}/{postgres_db}')
    conn_postgres = engine.connect()

    # Read the Excel file
    df_settings = pd.read_excel(uploaded_file_path, sheet_name="settings")

    # Extract campaign settings
    campaign_name = df_settings.loc[df_settings['setting'] == "campaign_name"]['value'].values[0]
    seller_company = df_settings.loc[df_settings['setting'] == "company"]['value'].values[0]
    seller_website = df_settings.loc[df_settings['setting'] == "website"]['value'].values[0]

    # Process the data (e.g., save it to PostgreSQL)
    campaigns_table_to_sql(conn_postgres, campaign_name, seller_company, seller_website)

    conn_postgres.close()

def campaigns_table_to_sql(conn, name, company, website):
    # Create a DataFrame and insert it into the PostgreSQL table
    df_campaign = pd.DataFrame(columns=['name', 'company_name', 'company_site'])
    df_campaign.at[0, 'name'] = name
    df_campaign.at[0, 'company_name'] = company
    df_campaign.at[0, 'company_site'] = website
    df_campaign.to_sql("Campaigns_temp", conn, index=False, if_exists="replace")

# Get the uploaded file path from the command-line argument
uploaded_file_path = sys.argv[1]

# Call the setup_campaign function
setup_campaign(uploaded_file_path)
