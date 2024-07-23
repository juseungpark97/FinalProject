import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 50px; /* 네비게이션 바와 겹치지 않도록 여백 추가 */
  background-color: #f0f2f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
`;

const Th = styled.th`
  padding: 10px;
  background: #007bff;
  color: white;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: #f1f1f1;
  }
`;

const Modal = styled.div`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Error = styled.p`
  color: red;
`;

function FlightSearch() {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: ''
  });

  const [results, setResults] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [error, setError] = useState('');
  const [isSearchCompleted, setIsSearchCompleted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('http://localhost:8088/api/flights/search', { params: searchParams })
      .then(response => {
        setResults(response.data);
        setError('');
        setIsSearchCompleted(true);
      })
      .catch(error => {
        const errorMessage = error.response?.data || 'Failed to fetch flights.';
        setError(errorMessage);
        setIsSearchCompleted(false);
      });
  };

  const handleRowClick = (flight) => {
    setSelectedFlight(flight);
  };

  const handleCloseModal = () => {
    setSelectedFlight(null);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Search Flights</Title>
        <Label htmlFor="origin">Origin (IATA code):</Label>
        <Input
          type="text"
          id="origin"
          name="origin"
          value={searchParams.origin}
          onChange={handleChange}
          required
        />
        <Label htmlFor="destination">Destination (IATA code):</Label>
        <Input
          type="text"
          id="destination"
          name="destination"
          value={searchParams.destination}
          onChange={handleChange}
          required
        />
        <Label htmlFor="departureDate">Departure Date:</Label>
        <Input
          type="date"
          id="departureDate"
          name="departureDate"
          value={searchParams.departureDate}
          onChange={handleChange}
          required
        />
        {error && <Error>{error}</Error>}
        <Button type="submit">Search</Button>
      </Form>
      {isSearchCompleted && (
        <Table>
          <thead>
            <tr>
              <Th>Origin</Th>
              <Th>Destination</Th>
              <Th>Departure Date</Th>
              <Th>Price (KRW)</Th>
            </tr>
          </thead>
          <tbody>
            {results.map((flight, index) => (
              <tr key={index} onClick={() => handleRowClick(flight)}>
                <Td>{flight.origin}</Td>
                <Td>{flight.destination}</Td>
                <Td>{flight.departureDate}</Td>
                <Td>{flight.price.toLocaleString()}원</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal isOpen={selectedFlight !== null}>
        <ModalContent>
          {selectedFlight && (
            <>
              <h2>선택된 항공편 정보</h2>
              <p>출발지: {selectedFlight.origin}</p>
              <p>도착지: {selectedFlight.destination}</p>
              <p>출발 날짜: {selectedFlight.departureDate}</p>
              <p>가격: {selectedFlight.price.toLocaleString()} 원</p>
              <CloseButton onClick={handleCloseModal}>닫기</CloseButton>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default FlightSearch;
