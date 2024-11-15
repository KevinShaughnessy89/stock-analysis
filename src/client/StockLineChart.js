import { ResponsiveLine } from '@nivo/line'

const StockLineChart = ({ graphState }) => {

    console.log("graphState: ", graphState);

    return (
          <div style={{ height: '300px' }}>
              <ResponsiveLine
                  data={graphState.isValid ? graphState.priceData : 
                  [
                    {id: "empty", 
                      data: [
                        {x: new Date(NaN),
                          y: null
                        }
                    ]}
                  ]}
                  margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                  theme={{
                    textColor: "#ffffff"
                  }}
                  curve="natural"
                  enableArea={true}
                  enablePoints={false}
                  useMesh={graphState.isValid}
                  // Motion
                  animate={true}
                  motionConfig="gentle"
                  motionDamping={15}
                  motionStiffness={90}
                  // Axis scale
                  xScale={{
                    type: 'time',
                    precision: 'day'
                  }}
                  yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto'
                  }}
                  axisBottom={{
                    tickSize: 10,
                    tickValues: 5,
                    tickPadding: 5,
                    format: (value) => {
                      if (isNaN(value)) return '';
                      const date = new Date(value);
                      return date instanceof Date && !isNaN(date) 
                        ? date.toLocaleDateString() 
                        : '';
                    },
                    tickRotation: 0,
                    legend: 'Day',
                    legendOffset: 36,
                    legendPosition: 'middle'
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Price',
                    legendOffset: -40,
                    legendPosition: 'middle'
                  }}
              />
          </div>
    )
}

export default StockLineChart