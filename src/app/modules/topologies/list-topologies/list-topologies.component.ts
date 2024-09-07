import { Component, ViewChild } from '@angular/core';
//import { Edge, Node, Layout } from '@swimlane/ngx-graph';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly';
import { stepRound } from './customStepCurved';
import { ElementRef, Renderer2 } from '@angular/core';
import {VisNetworkService, Data, DataSet, Node, Options, Edge } from 'ngx-vis'
declare var vis :any;

@Component({
  selector: 'app-list-topologies',
  templateUrl: './list-topologies.component.html',
  styleUrls: ['./list-topologies.component.scss']
})
export class ListTopologiesComponent {
  //npm i ngx-vis@3.1.0-build1627370228 --force version de Vis
  @ViewChild("siteConfigNetwork",{static: true})
  networkContainer!: ElementRef;
  @ViewChild("svgNetwork", {static: true})
  svgNetworkContainer!: ElementRef;
  public network:any;
  constructor(){ };
  
  ngOnInit(){
    setTimeout(() => {
      this.drawSvgNetwork();
      var treeData = this.getTreeData();
      this.loadVistree(treeData)
    }, 1000);
  }

  ngAfterViewInit() {
  }

  loadVistree(treeData:any){
    var options ={
      interaction:{
        hover:true
      },
      manipulation:{
        enabled:true
      }
    };
    var container = this.networkContainer.nativeElement;
    this.network = new vis.Network(container, treeData, options);
    var that = this;
    this.network.on('hoverNode', function (params:any){
      console.log('hovernode ', params);
    });
    this.network.on("blurNode", function (params:any){
      console.log('blurNode ', params);
    });
  }

  getTreeData(){

    var nodes=[
      {id:1, label:'Node 1', title:'I am node 1'},
      {id:2, label:'Node 2', title:'I am node 2'},
      {id:3, label:'Node 3'},
      {id:4, label:'Node 4'},
      {id:5, label:'Node 5'}
    ];

    var edges = [
      {from: 1, to:3},
      {from: 1, to:2},
      {from: 2, to:4},
      {from: 2, to:5},
    ];

    var treeData ={
      nodes: nodes,
      edges: edges
    };
    return treeData;
  }

  drawSvgNetwork() {
    var nodes = null;
    var edges = null; 
    var network = null;
    var DIR = 'img/refresh-cl/';
    var LENGTH_MAIN = 150;
    var LENGTH_SUB = 50;
    //var url = "data:image/svg+xml;charset=utf-8,"+ encodeURIComponent(svg);
    let server = "/assets/icons/Topologies/Server.svg";

    let switches = "/assets/icons/Topologies/Switch.svg";

    let router ="/assets/icons/Topologies/Router.svg";
    let pc ='pc';
    let withEdges:any =260
    // Create a data table with nodes.
    nodes = [];

    // Create a data table with links.
    edges = [];
    //Nodos(Equipos)
    nodes.push({id: 1, label: 'Switch 1', image: switches, shape: 'image'});
    nodes.push({id: 2, label: 'Switch 2', image: switches, shape: 'image'});
    nodes.push({id: 3, label: 'Switch 3', image: switches, shape: 'image'});
    nodes.push({id: 4, label: 'Switch 5', image: switches, shape: 'image'});
    nodes.push({id: 5, label: 'Switch 7', image: switches, shape: 'image'});
    nodes.push({id: 6, label: 'Router_A', image: router, shape: 'image'});
    
    //Conexiones X a Y etc
    //Conexiones de Router a Switch 2
    edges.push({from: 6, to: 2, length: withEdges, color:{ color:'#000000',
                                                    highlight:'#000000',
                                                    hover: '#000000',
                                                    inherit: 'from',
                                                    opacity:1.0},
                                                    label: 'RR(3/0/4-1/14/14)'
    });
    //Conexion S5 a S3
    edges.push({from: 4, to: 3, length: withEdges, color:{ color:'#000000',
                                                    highlight:'#000000',
                                                    hover: '#000000',
                                                    inherit: 'from',
                                                    opacity:1.0},
                                                    label: 'S(1/0/5-1/1/5)'
    });
    //Conexion S3 a S2
    edges.push({from: 3, to: 2, length: withEdges, color:{ color:'#000000',
                                                    highlight:'#000000',
                                                    hover: '#000000',
                                                    inherit: 'from',
                                                    opacity:1.0},
                                                    label: 'S(1/1/16-1/3/5)'
    });
    //Conexion S2 a S1
    edges.push({from: 2, to: 1, length: withEdges, color:{ color:'#000000',
                                                    highlight:'#000000',
                                                    hover: '#000000',
                                                    inherit: 'from',
                                                    opacity:1.0},
                                                    label: 'S(1/1/7-1/3/5)'
    });
    //Conexion S1 a S7
    edges.push({from: 1, to: 5, length: withEdges, color:{ color:'#000000',
                                                    highlight:'#000000',
                                                    hover: '#000000',
                                                    inherit: 'from',
                                                    opacity:1.0},
                                                    label: 'S(1/1/4-0/1/2)'
    });
    //Conexion R1 a S7
    edges.push({from: 6, to: 5, length: withEdges, color:{ color:'#000000',
                                                    highlight:'#000000',
                                                    hover: '#000000',
                                                    inherit: 'from',
                                                    opacity:1.0},
                label:'RS(0/1/2-3/1/2)'
                
    });

    // create a network
    var container = this.svgNetworkContainer.nativeElement;            

    //var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        physics: {stabilization: false},
        edges: {smooth: false}
    };
    //network = new vis.Network(container, data, options);
    this.network = new vis.Network(container, data, options);
  } 
}
