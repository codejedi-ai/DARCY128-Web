import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { RotateCw } from 'lucide-react';
import Image from 'next/image';


interface UserData {
  x: number;
  y: number;
  name: string;
  email: string;
  instagram: string;
  discord: string;
}

interface PlotLayout {
  'xaxis.range[0]'?: number,
  'xaxis.range[1]'?: number,
  'yaxis.range[0]'?: number;
  'yaxis.range[1]'?: number;
}

const ScatterChartComponent = () => {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [data, setData] = useState<UserData[]>([]);
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [plotLayout, setPlotLayout] = useState<PlotLayout>({
    'xaxis.range[0]': -10,
    'xaxis.range[1]': 10,
    'yaxis.range[0]': -10,
    'yaxis.range[1]': 10,
  });
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/fetch-users?userId=anonymous`);
      const fetchedData = await response.json();
      console.log('Fetched data:', fetchedData);
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const firstUser = data[0]; // Take the first data point
      const span = 5; // Adjust this value to control the zoom level
  
      setPlotLayout({
        'xaxis.range[0]': firstUser.x - span,
        'xaxis.range[1]': firstUser.x + span,
        'yaxis.range[0]': firstUser.y - span,
        'yaxis.range[1]': firstUser.y + span,
      });
    }
  }, [data]); 

  const getInstagramUsername = (url: string) => {
    return url.split('instagram.com/')[1] || url;
  };

  const handlePointClick = (event: {points: Array<{pointIndex: number}>}) => {
    if (event.points && event.points[0]) {
      const pointIndex = event.points[0].pointIndex;
      const clickedUser = data[pointIndex];
      setSelectedUser(clickedUser);
    
      // Center the view on the clicked point
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentXRange = (plotLayout as any)['xaxis.range[1]'] - (plotLayout as any)['xaxis.range[0]'];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentYRange = (plotLayout as any)['yaxis.range[1]'] - (plotLayout as any)['yaxis.range[0]'];

      
      setPlotLayout({
        'xaxis.range[0]': clickedUser.x - currentXRange/2,
        'xaxis.range[1]': clickedUser.x + currentXRange/2,
        'yaxis.range[0]': clickedUser.y - currentYRange/2,
        'yaxis.range[1]': clickedUser.y + currentYRange/2,
      });
    }
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
    fetchData();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRelayout = (eventData: any) => {
    // Check if eventData exists and has the required properties
    if (!eventData) return;
  
    try {
      const newLayout: PlotLayout = {};
  
      // Safely get the ranges
      if (eventData['xaxis.range[0]'] !== undefined && eventData['xaxis.range[1]'] !== undefined) {
        newLayout['xaxis.range[0]'] = eventData['xaxis.range[0]'];
        newLayout['xaxis.range[1]'] = eventData['xaxis.range[1]'];
      }
  
      if (eventData['yaxis.range[0]'] !== undefined && eventData['yaxis.range[1]'] !== undefined) {
        newLayout['yaxis.range[0]'] = eventData['yaxis.range[0]'];
        newLayout['yaxis.range[1]'] = eventData['yaxis.range[1]'];
      }
  
      // Only update if we have valid ranges
      if (Object.keys(newLayout).length > 0) {
        setPlotLayout(newLayout);
      }
    } catch (error) {
      console.error('Error in handleRelayout:', error);
    }
  };


  return (
    <div className="relative bg-transparent pt-10">
       <div className="absolute top-4 left-4 right-4 z-10 flex items-center">
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full bg-black border border-cyan-400/30 text-cyan-400
            hover:bg-cyan-950/50 hover:text-cyan-300
            transition-all duration-200 shadow-lg"
        >
          <RotateCw className="w-7 h-7" />
        </button>
        
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white animate-fade pt-4">
          Your Perspectr Network
        </h1>
      </div>

      <Plot
        key={key}
        data={[
          {
            x: Array.isArray(data) ? data.map((d) => d.x) : [],
            y: Array.isArray(data) ? data.map((d) => d.y) : [],
            mode: "text+markers" as const,
            type: 'scatter',
            marker: {
              size: 40,
              color: Array.isArray(data)
                ? data.map(() => "rgba(0, 255, 255, 0.6)")    // Default color for all users
                : [],
              symbol: "circle",
              line: {
                color: "rgb(0, 191, 255)",
                width: 2,
              },
            },
            text: Array.isArray(data) 
              ? data.map(() => "🌟")
              : [],
              textfont: {
                size: 20,  // Increase this number to make the text bigger
              },
            textposition: "middle center" as const,
            hoverinfo: "none" as const,
          }
        ]}
        layout={{
          paper_bgcolor: "black",
          plot_bgcolor: "black",
          font: {
            family: "Arial, sans-serif",
            color: "white",
          },
          xaxis: {
            showgrid: true,
            gridcolor: "rgba(255, 255, 255, 0.1)",
            zeroline: false,
            showticklabels: false,
            fixedrange: false,
            constraintoward: 'center',
            range: (plotLayout as PlotLayout)['xaxis.range[0]']
                ? [(plotLayout as PlotLayout)['xaxis.range[0]'], (plotLayout as PlotLayout)['xaxis.range[1]']]
                : undefined
          },
          yaxis: {
            showgrid: true,
            gridcolor: "rgba(255, 255, 255, 0.1)",
            zeroline: false,
            showticklabels: false,
            fixedrange: false,
            constraintoward: 'center',
            range: (plotLayout as PlotLayout)['yaxis.range[0]']
                ? [(plotLayout as PlotLayout)['yaxis.range[0]'], (plotLayout as PlotLayout)['yaxis.range[1]']]
                : undefined
          },
          showlegend: false,
          dragmode: 'pan',

        }}
        style={{
          width: "100%",
          height: "90vh",
        }}
        config={{
          displayModeBar: false,
          responsive: true,
          scrollZoom: true,  
        }}
        onClick={handlePointClick}
        onRelayout={handleRelayout}
      />

      {/* Modal Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-cyan-400 rounded-lg p-6 max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* User Info */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Image 
                    src="/email.png"
                    alt="Email"
                    width={24}
                    height={24}
                  />
                  <a 
                      href={`mailto:${selectedUser.email}`}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                    {selectedUser.email}
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-gray-300">
                  <Image 
                    src="/instagram.png"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                  <a 
                    href={selectedUser.instagram}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {getInstagramUsername(selectedUser.instagram)}
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-gray-300">
                  <Image 
                    src="/discord.png"
                    alt="Discord"
                    width={24}
                    height={24}
                  />
                  <span>{selectedUser.discord}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScatterChartComponent;
