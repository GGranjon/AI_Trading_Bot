from datetime import datetime, timezone
import os

def get_btc_subfile_and_index(time_id):
    first_time = 1325412060
    diff = time_id - first_time
    diff /= 60
    filename = ""
    index = -1
    time_caps = {1385412000:"btc_data_sub1.csv", 1445412000:"btc_data_sub2.csv", 1505412000:"btc_data_sub3.csv",
                 1565412000:"btc_data_sub4.csv", 1625412000:"btc_data_sub5.csv", 1685412000:"btc_data_sub6.csv", 1756943760:"btc_data_sub7.csv"}
    for key in time_caps.keys():
        if time_id <= key :
            filename = time_caps[key]
            first_time = (key - 71531640) if key == 1756943760 else (key - 60000000)
            diff = int((time_id - first_time)/60)
            index = max(0,diff - 5000)  # margin of error
            break
    return filename, index

def get_data_from_csv(time_id, num_elt):
    first_time = 1325412060
    last_time = 1756943760
    time_id = float(time_id)
    if time_id < first_time or time_id > last_time:
        return {"o":[0]*num_elt, "c":[0]*num_elt, "h":[0]*num_elt, "l":[0]*num_elt}
    
    filename, index = get_btc_subfile_and_index(time_id)
    filepath = os.path.join("data/", filename)
    file = open(filepath, "r")
    file.readline()

    data = file.readlines()
    start_index = -1
    for i in range(index, len(data)):
        content = data[i].split(",")
        if abs(time_id - float(content[0]))/60 < 2 :
            start_index = i
            break
    if start_index == -1:
        return {"o":[0]*num_elt, "c":[0]*num_elt, "h":[0]*num_elt, "l":[0]*num_elt}
    
    data = data[int(start_index):int(start_index)+int(num_elt)]
    filtered_data = {"o":[], "c":[], "h":[], "l":[]}
    for elt in data:
        content = elt.split(",")
        filtered_data["o"].append(float(content[1]))
        filtered_data["c"].append(float(content[4]))
        filtered_data["h"].append(float(content[2]))
        filtered_data["l"].append(float(content[3]))
    return filtered_data

def to_unix_time(time):
    """time is in format YYYY-MM-DD-HH-MM"""
    dt = datetime.strptime(time, "%Y-%m-%d-%H-%M")
    # Make it timezone-aware (UTC) and return timestamp
    return dt.replace(tzinfo=timezone.utc).timestamp()