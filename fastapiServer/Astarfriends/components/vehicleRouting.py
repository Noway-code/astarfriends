import json
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import numpy as np

def create_data_model(osrmdata, types, markercounts):
    # Round osrmdata['distances'] to int
    rounded = [[round(i) for i in row] for row in osrmdata['distances']]

    end_depots = np.full(markercounts['driver_count'], types['destinations'][0]).tolist()
    data = {
        'distance_matrix': rounded,
        "num_vehicles": markercounts['driver_count'],
        "start_depots": types['drivers'],
        "end_depots": end_depots,
    }
    # Instantiate the data problem.
    print(data)

    return data

def print_solution(data, manager, routing, solution):
    """Prints solution on console."""
    print(f"Objective: {solution.ObjectiveValue()}")
    max_route_distance = 0
    for vehicle_id in range(data["num_vehicles"]):
        index = routing.Start(vehicle_id)
        plan_output = f"Route for vehicle {vehicle_id}:\n"
        route_distance = 0
        while not routing.IsEnd(index):
            plan_output += f" {manager.IndexToNode(index)} -> "
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id
            )
        plan_output += f"{manager.IndexToNode(index)}\n"
        plan_output += f"Distance of the route: {route_distance}m\n"
        print(plan_output)
        max_route_distance = max(route_distance, max_route_distance)
    print(f"Maximum of the route distances: {max_route_distance}m")

def gettypeindex(allmarkers, markercounts):
    # all markers are in the order of drivers, destinations, houses and we know the counts of each
    # return a broken down dicti
    drivers = list(range(markercounts['driver_count']))
    destinations = list(range(markercounts['driver_count'], markercounts['driver_count'] + markercounts['destination_count']))
    houses = list(range(markercounts['driver_count'] + markercounts['destination_count'], markercounts['total_markers']))

    # make a 2d list of the indexes
    return {
        'drivers': drivers,
        'destinations': destinations,
        'houses': houses
    }

def vehicle_routing(osrmdata, markercounts):
    # Create the routing index manager.
    types = gettypeindex(osrmdata['distances'], markercounts)
    print(types)

    data = create_data_model(osrmdata, types, markercounts)

    # Create the routing index manager.
    manager = pywrapcp.RoutingIndexManager(
        len(data["distance_matrix"]),
        data["num_vehicles"],
        data["start_depots"],  # Pass start depots
        data["end_depots"]
    )

    # Create Routing Model.
    routing = pywrapcp.RoutingModel(manager)

    # Create and register a transit callback.
    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data["distance_matrix"][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of each arc.
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add Distance constraint.
    dimension_name = "Distance"
    routing.AddDimension(
        transit_callback_index,
        5,  # no slack
        50000,  # vehicle maximum travel distance
        True,  # start cumul to zero
        dimension_name,
    )
    distance_dimension = routing.GetDimensionOrDie(dimension_name)
    distance_dimension.SetGlobalSpanCostCoefficient(100)

    # Setting first solution heuristic.
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    # Solve the problem.
    solution = routing.SolveWithParameters(search_parameters)

    # Print solution on console.
    if solution:
        print_solution(data, manager, routing, solution)
    else:
        print("No solution found!")
