
# import json module
import json

# import networkx to construct netowrks
import networkx as nx 

# import json_graph to output jsons 
from networkx.readwrite import json_graph


# import graph_atlas_g


# # import http_server module
# import http_server

print('here')

# generate some netowrk 
# G = nx.hypercube_graph(5)
# G = nx.barbell_graph(6,3)
# G = nx.fast_gnp_random_graph(400,0.005)
G = nx.barabasi_albert_graph(50,2)
# G = 

# this d3 example uses the name attribute for the mouse-hover value,
# so add a name to each node
for n in G:
    G.node[n]['name'] = n

# return data in node-link format that is suitable for JSON serialization and use
# in Javascript documents
d = json_graph.node_link_data(G)

# write json
json.dump(d, open('networkx.json','w'))


