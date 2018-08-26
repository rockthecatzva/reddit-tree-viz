import React from "react";
import PropTypes from "prop-types";
import { select, selectAll } from "d3-selection";

export default class ReactD3Wrapper extends React.Component {
  state = {
    treeBranches: []
  };

  margin = { top: 5, bottom: 5, left: 5, right: 5 };

  drawTrees = data => {
    const t = data[1];
    console.log(t);

    const ROOT_HEIGHT = 10,
      TOTAL_RADIUS = 200,
      BRANCH_ANGLE_RANDOMIZER = factor => Math.random() * factor;

    let branchCount = -1;
    const recursivelyDrawBranch = (data, group, rootPosition = 0) =>
      data.map((d, i) => {
        if (d.hasOwnProperty("replies")) {
          if(rootPosition===0) branchCount+=1;
          //console.log("  - ", rootPosition + 1, branchCount)
          //const r = recursivelyDrawBranch(d.replies, rootPosition + 1);
          // return { ...d, rootPosition: rootPosition, replies: r, branchCount: i * rootPosition};

          const g = group.append("g").attr("transform", "translate("+(i*30)+","+((branchCount+rootPosition)*30)+")");
          // console.log(rootPosition)
          g.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 10)
            .attr("fill", "green")
            .on("mouseenter", ()=>{console.log(i, rootPosition, branchCount, d)});
          recursivelyDrawBranch(d.replies, g, rootPosition + 1);
        } else {
          group
            .append("circle")
            .attr("cx", (i+1)*30)
            .attr("cy", 0)
            .attr("r", 10)
            .attr("fill", "red")
            .on("mouseenter", ()=>{console.log(i, rootPosition, branchCount, d)});
          // return { ...d, rootPosition: rootPosition, branchCount: i * rootPosition };
        }

        console.log(rootPosition, branchCount, i, d.comment)
      });

    // const recursivelyFlattenData = data => {
    //   return data.reduce((acc, curr) => {
    //     if (curr.hasOwnProperty("children")) {
    //       //const r = recursivelyDrawBranch(d.replies, rootPosition + 1);
    //       // return { ...d, rootPosition: rootPosition, children: r };
    //       return [...acc, curr, ...recursivelyFlattenData(curr.children)];
    //     } else {
    //       return [...acc, curr];
    //     }
    //   }, [])
    //   //.reduce((acc,curr)=>curr.comment ? [...acc, curr]:acc,[]);
    // };

    // const makeTrees = data => {
    //   data.forEach(e => {
    //     // const x1,
    //     // y1,
    //     // x2,
    //     // y2,
    //     // onHover = ()=>{console.log("Hover")};

    //     const cx = 10,
    //       cy = e.rootPosition * 10,
    //       r = 10,
    //       onHover = ()=>{console.log("Hover")};

    //     return <circle cx={cx} cy={cy} r={r} onMouseEnter={()=>{console.log("Hover")}} />;
    //   });
    //   // this.g
    //   //   .selectAll("circle")
    //   //   .data(data)
    //   //   .enter()
    //   //   .append("circle")
    //   //   .attr("cx", d=> d.branchCount * 20)
    //   //   .attr("cy",d=> d.rootPosition * 20)
    //   //   .attr("r", 8)
    //   //   .attr("fill", "red")
    //   //   .on("mouseenter", (d)=>{console.log(d)});
    // };

    recursivelyDrawBranch(t.replies, this.g);

    //makeTrees(recursivelyFlattenData(recursivelyDrawBranch(t.replies, 0)));
  };

  componentDidMount() {
    const s = select(this.ref).select("svg");
    this.g = s
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
    if (this.props.chartData.length > 0) {
      this.drawTrees(this.props.chartData);
    }
  }

  componentDidUpdate() {
    if (this.props.chartData.length > 0) {
      this.drawTrees(this.props.chartData);
    }
  }

  render() {
    return (
      <div ref={ref => (this.ref = ref)}>
        <svg className="svg-container">{this.state.treeBranches}</svg>
      </div>
    );
  }
}

ReactD3Wrapper.propTypes = {
  chartData: PropTypes.array
};
