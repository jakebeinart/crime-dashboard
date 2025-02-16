# First, let's just read the first few lines of the CSV to see the column names
import pandas as pd

# Read just the column names first
df_columns = pd.read_csv('raw_2021-2024.csv', nrows=0)
print("Actual columns in your file:")
print(df_columns.columns.tolist())