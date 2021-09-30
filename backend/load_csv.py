import csv
import psycopg2 as pg2
import math
import os

# connect db
dbName = "coviddb"
dbUser = "postgres"
dbPass = "Pgis@rti2dss@2020"
dbHost = "119.59.125.134"
dbPort = "5432"

conn = pg2.connect(database=dbName, user=dbUser,
                   password=dbPass, host=dbHost, port=dbPort)
conn.autocommit = True
cursor = conn.cursor()

def insertDb(dat):
    sql = '''INSERT INTO _covidth_r12(txn_date,gender,age_number,age_range,nationality,job,risk,patient_type,province)VALUES(
        '{txn_date}','{gender}',{age_number},'{age_range}','{nationality}','{job}','{risk}','{patient_type}','{province}')'''.format(
        txn_date=dat[0],gender=dat[2],age_number=dat[3],age_range=dat[4],nationality=dat[5],job=dat[6],risk=dat[7],patient_type=dat[8],province=dat[9])
    
    # print(sql)
    cursor.execute(sql)


def main():
    csv_file = open(r"./round-1to2-line-lists.csv")
    csv_reader = csv.reader(csv_file, delimiter=',')
    i = 0
    for row in csv_reader:
        if i > 0:
            insertDb(row)
        i+=1
        print(i)

if __name__ == "__main__":
    main()