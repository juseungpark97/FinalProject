import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DataType {
  조회수: number;
  name: string;
  fill: string; // 추가된 색상 필드
}

// const generateRandomColor = (): string => {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return `rgb(${r}, ${g}, ${b})`;
// };

// 데이터 생성 시 랜덤 색상 추가
// const data: DataType[] = [
//   { name: '장르1', 조회수: 400, fill: generateRandomColor() },
//   { name: '장르2', 조회수: 300, fill: generateRandomColor() },
//   { name: '장르3', 조회수: 30, fill: generateRandomColor() },
//   { name: '장르4', 조회수: 20, fill: generateRandomColor() },
//   { name: '장르5', 조회수: 70, fill: generateRandomColor() },
//   { name: '장르6', 조회수: 30, fill: generateRandomColor() },
//   { name: '장르7', 조회수: 10, fill: generateRandomColor() },
//   { name: '장르8', 조회수: 75, fill: generateRandomColor() },
//   { name: '장르9', 조회수: 30, fill: generateRandomColor() },
//   { name: '장르10', 조회수: 34, fill: generateRandomColor() },
//   { name: '장르11', 조회수: 36, fill: generateRandomColor() },
//   { name: '장르12', 조회수: 26, fill: generateRandomColor() },
//   { name: '장르13', 조회수: 30, fill: generateRandomColor() },
//   { name: '장르14', 조회수: 37, fill: generateRandomColor() }
// ];

const ChartComponent = () => {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8088/dashboard/getGenreView')
      .then((res) => {
        setData(res.data);
      })
      .catch(error => {
        console.error("Error fetching data", error);
      });
  }, []);

  return (
    <div>
      <h2>장르별 조회수</h2>
      <BarChart
        width={1000}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="조회수" isAnimationActive={false}>
          {data.map((entry, index) => (
            <Bar key={`bar-${index}`} dataKey="조회수" fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </div>
  )
};

export default ChartComponent;
