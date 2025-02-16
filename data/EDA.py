import pandas as pd
import ydata_profiling
from datetime import datetime

# Your existing data loading code
dtypes = {
    'IncidentNum': 'str',
    'Offense': 'category',
    'NIBRS': 'category',
    'NIBRSCategory': 'category',
    'SRS_UCR': 'category',
    'CrimeAgainst': 'category',
    'FelMisdCit': 'category',
    'IncidentTopSRS_UCR': 'category',
    'IncidentLocation': 'category',
    'District': 'category',
    'Neighborhood': 'category',
    'NbhdNum': 'category',
    'Latitude': 'float64',
    'Longitude': 'float64',
    'FirearmUsed': 'category',
    'IncidentNature': 'category'
}

date_columns = ['IncidentDate', 'LastSuppDate']
df = pd.read_csv('raw_2021-2024.csv', dtype=dtypes, parse_dates=date_columns)

# Handle the time column with explicit format
df['OccurredFromTime'] = pd.to_datetime(df['OccurredFromTime'], format='%H:%M:%S').dt.time

# Create time-based features
df['Year'] = df['IncidentDate'].dt.year
df['Month'] = df['IncidentDate'].dt.month
df['DayOfWeek'] = df['IncidentDate'].dt.day_name()

# Create the profile report with corrected parameters
profile = ydata_profiling.ProfileReport(
    df, 
    title="St. Louis Crime Data Analysis",
    tsmode=True,  # Enable time series mode
    samples=None
)

# Save the report
profile.to_file("crime_data_profile.html")