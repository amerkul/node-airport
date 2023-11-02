import { FlightStatus } from "../../src/model/enum/flight-status";
import { Flight } from "../../src/model/flight";
import { FlightGraph } from "../../src/service/util/graph";

const flights: Flight[] = [
    {
        id: 1,
        depature: '2023-10-31 00:00:00',
        arrival: '2023-11-01 00:00:00',
        price: 400,
        status: FlightStatus.SCHEDULED,
        from: {
          id: 1,
          name: 'National Airport Minsk',
          country: 'Belarus',
          city: 'Minsk'
        },
        to: {
          id: 2,
          name: 'Brussels International Airport',
          country: 'Belgium',
          city: 'Brussels'
        },
        airline: { id: 1, name: 'Belavia' },
        airplane: { id: 1, name: 'Boeing 737-500' }
      },
      {
        id: 2,
        depature: '2023-11-01 05:00:00',
        arrival: '2023-11-02 00:00:00',
        price: 500,
        status: FlightStatus.SCHEDULED,
        from: {
          id: 2,
          name: 'Brussels International Airport',
          country: 'Belgium',
          city: 'Brussels'
        },
        to: {
          id: 3,
          name: 'National Airport Italy',
          country: 'Italy',
          city: 'Rome'
        },
        airline: { id: 2, name: 'Brussels Airlines' },
        airplane: { id: 2, name: 'Boeing 737-800' }
      },
      {
        id: 3,
        depature: '2023-10-31 00:00:00',
        arrival: '2023-11-01 07:00:00',
        price: 400,
        status: FlightStatus.SCHEDULED,
        from: {
          id: 1,
          name: 'National Airport Minsk',
          country: 'Belarus',
          city: 'Minsk'
        },
        to: {
          id: 3,
          name: 'National Airport Italy',
          country: 'Italy',
          city: 'Rome'
        },
        airline: { id: 1, name: 'Belavia' },
        airplane: { id: 5, name: 'Boeing 737-555' }
      },

];
test('Test graph', () => {
    const graph = new FlightGraph();
    graph.addVertex('Belarus, Minsk');
    graph.addVertex('Belgium, Brussels');
    graph.addVertex('Italy, Rome');
    graph.addEdge('Belarus, Minsk', 'Belgium, Brussels', flights[0]);
    graph.addEdge('Belgium, Brussels', 'Italy, Rome', flights[1]);
    graph.addEdge('Belarus, Minsk', 'Italy, Rome', flights[2]);
    expect(graph.getAllPaths('Belarus, Minsk', 'Italy, Rome').length).toBe(2);
});