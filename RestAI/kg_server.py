import sys
import re
import pandas as pd
import torch
import json
print(torch.cuda.is_available())
from typing import List, Dict
from SPARQLWrapper import SPARQLWrapper, JSON
from flask import Flask, request, url_for, jsonify, make_response
from transformers import pipeline, AutoModelForSeq2SeqLM, T5TokenizerFast
from flask_cors import CORS, cross_origin
from urllib.parse import urlparse, parse_qs

print("Model setup started...")

df_q = pd.read_csv(f'../data/q.csv')
df_p = pd.read_csv(f'../data/p.csv')

prefix = "translate english to sparql: "
model_name = "alexandrualexandru/final-3.0-t5-base-2023-06-20_13-18"

model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to("cuda")
tokenizer = T5TokenizerFast.from_pretrained(model_name)

translator = pipeline(
    "translation_xx_to_yy",
    model=model,
    tokenizer=tokenizer,
    device=0 
)

# Function to extract entity ID from Wikidata URL
def extract_entity_id(wikidata_url):
    # Extract the entity ID from the Wikidata URL
    return wikidata_url.split("/")[-1]

def query_wikidata_labels(entity_id, property_ids):
    endpoint_url = "https://query.wikidata.org/sparql"
    user_agent = "WDQS-example Python/%s.%s" % (sys.version_info[0], sys.version_info[1])
    
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)

    results = []
    for prop_id in property_ids:
        property_values = f"wd:{entity_id} wdt:{prop_id} ?{prop_id}. "
    
        # Construct the SPARQL query
        query = f"""
        SELECT ?{prop_id} ?{prop_id}Label
        WHERE {{
            {property_values}
            SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }}
        }}
        """
        # Set the SPARQL query and response format
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        
        # Execute the query and retrieve the results
        result = sparql.query().convert()
        results.append(result)
    return results

def replace_all(text, dict):
    for i, j in dict.items():
        text = text.replace(i, j)
    return text

def findID(pref, x):
    word = x.replace("_", " ").lower()
    try:
        if 'wd' != pref:
            s = df_p[df_p['en']==word]
            if len(s)>0:
                id = s.iloc[0]['id']
                return 'P'+str(id)
        s = df_q[df_q['en']==word]
        id = s.iloc[0]['id']
        return 'Q'+str(id)
    except: return x

def findWord(x):
    id = x[1:]
    try:
        # Use else to do not replace missing Ps with Qs
        s = df_q[df_q['id'] == int(id)].iloc[0]
        # s = df_q[df_q.en.str.contains(word, na=False)]
        word = s['en']
        word = str(word)
        return str(word)
    except: return x

def get_result(input):
    endpoint_url = "https://query.wikidata.org/sparql"

    query = """PREFIX bd: <http://www.bigdata.com/rdf#> 
    PREFIX dct: <http://purl.org/dc/terms/> 
    PREFIX geo: <http://www.opengis.net/ont/geosparql#> 
    PREFIX p: <http://www.wikidata.org/prop/> 
    PREFIX pq: <http://www.wikidata.org/prop/qualifier/> 
    PREFIX ps: <http://www.wikidata.org/prop/statement/> 
    PREFIX psn: <http://www.wikidata.org/prop/statement/value-normalized/> 
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
    PREFIX wd: <http://www.wikidata.org/entity/> 
    PREFIX wds: <http://www.wikidata.org/entity/statement/> 
    PREFIX wdt: <http://www.wikidata.org/prop/direct/> 
    PREFIX wdv: <http://www.wikidata.org/value/> 
    PREFIX wikibase: <http://wikiba.se/ontology#> 
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    """
    query = query + input

    user_agent = "WDQS-example Python/%s.%s" % (sys.version_info[0], sys.version_info[1])
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    query_results = sparql.query().convert()

    values = []
    for result in query_results['results']['bindings']:
        value = result
        values.append(value['sbj']['value'])

    

    return values

def decode_props(qry):
    rep_dict = {}
    qry = qry.replace("[", "{").replace("]", "}")
    for m in re.finditer(":\w+", qry):
        pref = qry[m.start(0) - 3 : m.start(0)].strip()
        rep_dict[':'+m.group(0)[1:]] = ':'+findID(pref, m.group(0)[1:])
    return replace_all(qry, rep_dict)

def translate(q):
    tr = translator(prefix+q, max_length=200)[0]['translation_text']
    return (tr, decode_props(tr))

print("Model setup finished...")

app = Flask(__name__)

@app.route("/infos", methods=["POST"])
def get_info():
    params = request.get_json()
    result, result_dec = translate(params["question"])
    answer = get_result(result_dec)
    print(result_dec)
    counter = 0
    data_companies = []
    data_industry = []
    data_location = []
    data_followers = []
    for a in answer:
        if counter == 15:
            break
        counter = counter + 1
        wikidata_url = a  # Replace with your Wikidata URL
        property_ids = ["P31", "P17", "P452", "P8687"]  # Replace with the desired property IDs

        entity_id = extract_entity_id(wikidata_url)
        data_companies.append({
            "company": findWord(entity_id)
        })
        results = query_wikidata_labels(entity_id, property_ids)
        # Extract the property labels from the results
        for result in results:
            property_labels = {}
            for prop_id in property_ids:
                if prop_id == result['head']['vars'][0]:
                    try:
                        property_labels[prop_id] = [binding[prop_id + 'Label']['value'] for binding in result['results']['bindings']]
                    except:
                        continue

            # Print the property labels
            for prop_id, labels in property_labels.items():
                if prop_id == "P452":
                    try:
                        data_industry.append({
                            "industrie": labels[0]
                        })
                    except:
                        data_industry.append({
                            "industrie": "none"
                        })
                if prop_id == "P17":
                    try:
                        data_location.append({
                            "location": labels[0]
                        })
                    except:
                        data_location.append({
                            "location": "none"
                        })
                if prop_id == "P8687":
                    try:
                        data_followers.append({
                            "popularity": labels[0]
                        })
                    except:
                        data_followers.append({
                            "popularity": "none"
                        })

    return {
        'answer': answer,
        'data_industry': data_industry,
        'data_location': data_location,
        'data_followers': data_followers,
        'data_companies': data_companies
    }

@app.route("/scrap", methods=["POST"])
def scrap_url():
    params = request.get_json()
    # Example usage
    wikidata_url = params['url'] 
    property_ids = ['P8687'] 

    # Extract entity ID from the Wikidata URL
    entity_id = wikidata_url.split('/')[-1]

    # Query properties using SPARQL
    properties = query_wikidata_properties(entity_id, property_ids)

    # Print the extracted properties
    for prop_id, values in properties.items():
        print(f"{prop_id}: {', '.join(values)}")
    
    return "Yes"
  
if __name__ == '__main__':  
   app.run(host="localhost", port=3000, debug=True)