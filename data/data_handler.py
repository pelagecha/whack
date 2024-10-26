# data/data_handler.py

import pandas as pd

def load_data(csv_file):
    """
    Loads the bank statement CSV file into a Pandas DataFrame.
    """
    df = pd.read_csv(csv_file, parse_dates=['Date'])
    return df

def get_categories(df):
    """
    Returns a list of unique categories from the DataFrame.
    """
    return df['Category'].dropna().unique().tolist()

def filter_data(df, start_date=None, end_date=None, categories=None):
    """
    Filters the DataFrame based on date range and categories.
    """
    filtered_df = df.copy()
    if start_date:
        filtered_df = filtered_df[filtered_df['Date'] >= start_date]
    if end_date:
        filtered_df = filtered_df[filtered_df['Date'] <= end_date]
    if categories:
        filtered_df = filtered_df[filtered_df['Category'].isin(categories)]
    return filtered_df
