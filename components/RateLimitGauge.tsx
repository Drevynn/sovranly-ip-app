'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RateLimitGauge({ percentage }: { percentage: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 120;
    const height = 120;
    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.attr('width', width).attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arc = d3.arc<number>()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(-Math.PI * 0.8)
      .endAngle(Math.PI * 0.8);

    // Background arc
    g.append('path')
      .datum(1)
      .attr('d', arc)
      .attr('fill', '#18181b'); // zinc-900

    // Value arc
    const endAngle = -Math.PI * 0.8 + (Math.PI * 1.6) * (percentage / 100);
    const valueArc = d3.arc<number>()
      .innerRadius(radius - 12)
      .outerRadius(radius)
      .startAngle(-Math.PI * 0.8)
      .endAngle(endAngle);

    g.append('path')
      .datum(1)
      .attr('d', valueArc)
      .attr('fill', percentage > 85 ? '#f43f5e' : percentage > 50 ? '#f59e0b' : '#06b6d4'); // rose-500, amber-500, cyan-500

  }, [percentage]);

  return <svg ref={svgRef} className="mx-auto" />;
}
