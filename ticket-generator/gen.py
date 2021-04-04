from os import write
import numpy as np
import random
import json

def import_info():
  with open("cities.txt", "r") as f:
    cities = f.readlines()
  with open("routes.txt", "r") as f:
    routes = f.readlines()
  cities = [city.strip() for city in cities]
  cities = sorted(cities)
  d = {val: idx for idx, val in enumerate(cities)}
  routes = [route.split() for route in routes]
  routes = [r if (r[0] < r[1]) else  [r[1], r[0], r[2]] for r in routes]
  routes = [(d[r[0]], d[r[1]], int(r[2])) for r in routes]
  
  return cities, routes

def floyd_warshall(n, edges):
  dist = np.full((n, n), np.inf)

  for e in edges:
    dist[e[0]][e[1]] = e[2]
    dist[e[1]][e[0]] = e[2]

  for v in range(n):
    dist[v][v] = 0
    
  for k in range(n):
    for i in range(n):
      for j in range(n):
        dist[i][j] = min(dist[i][k] + dist[k][j], dist[i][j])

  return dist.astype(int)

def dist_to_dict(dist):
  n = dist.shape[0]

  dic = [[] for i in range(30)]

  for i in range(n):
    for j in range(i):
      dic[dist[i][j]].append((i, j))

  return dic


city, edges = import_info()

dist = floyd_warshall(47, edges)

paths = dist_to_dict(dist)

def longs(paths):
  long_paths = []
  for (i, ps) in (list(enumerate(paths))[19:22]):
    ps = [(p[0], p[1], i) for p in ps]
    long_paths += ps
  
  tickets = []
  used = [False for _ in range(47)]
  used[40] = True #Stockholm
  used[14] = True #Edinburgh
  i = 0
  while i < 12:
    if len(long_paths) == 0:
      return tickets
    t = random.choice(long_paths)
    if (used[t[0]] or used[t[1]]):
      continue
    long_paths = [(c0, c1, w) for (c0, c1, w) in long_paths if c0 != t[0] and c0 != t[1] and c1 != t[0] and c1 != t[1]]
    tickets.append(t)
    used[t[0]] = True
    used[t[1]] = True
    i += 1
  
  return tickets

def shorts(paths):
  short_paths = []
  for (i, ps) in (list(enumerate(paths))[8:16]):
    ps = [(p[0], p[1], i) for p in ps]
    short_paths += ps

  random.shuffle(short_paths)

  return short_paths

def to_json(tickets):
  # indent=2 to "pretty" print
  return json.dumps([{"city1": c1, "city2": c2, "points": w} for (c1, c2, w) in tickets]) 

def write_file(fileName, object):
  f = open(fileName, "w")
  f.write(str(object))
  f.close()

long_tickets = longs(paths)
short_tickets = shorts(paths)
short_tickets = short_tickets

long_tickets = [(city[c1], city[c2], w) for (c1, c2, w) in long_tickets]
short_tickets = [(city[c1], city[c2], w) for (c1, c2, w) in short_tickets]

write_file('long-tickets.json', to_json(long_tickets))
write_file('short-tickets.json', to_json(short_tickets))
