import pandas as pd
import numpy as np
import json
import sys

def main():
    # Print a message indicating that the script has started
    print("Starting the script...")

    # Load the JSON data into a DataFrame
    df = pd.read_json('/home/kevinshaughessy89/Projects/stock-analysis/temp-data-cleaned.json')
    print(f"Data loaded. First few rows:\n{df.head()}")  # Print first few rows to inspect the data

    # Calculate the daily change in the 'Close' column
    df['change'] = df['close'].diff()

    # Calculate Gain and Loss columns
    df['gain'] = np.where(df['change'] > 0, df['change'], 0)
    df['loss'] = np.where(df['change'] < 0, df['change'], 0)

    # Set window size for RSI calculation
    windowSize = 14

    # Calculate the average gain and loss
    df['average gain'] = df['gain'].rolling(window=windowSize, min_periods=1).mean()
    df['average loss'] = df['loss'].rolling(window=windowSize, min_periods=1).mean()

    # Calculate the Relative Strength (RS) and RSI
    df['rs'] = df['average gain'] / df['average loss']
    df['rsi'] = 100 - (100 / (1 + df['rs']))

    df.drop(columns=['high', 'low', 'open', 'close', 'volume'], inplace=True)

    print(df.to_json(orient="records"), flush=True)

    

# Call the main function
if __name__ == "__main__":
    main()
