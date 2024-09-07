import { KnowledgeBaseNodeTypes } from "./knowledge-base-node-types";

export interface KnowledgeBaseNode {
  /**
 * Node interface for knowledge base
 *
 * @interface KnowledgeBaseNode
 * @member {string} name
 * @member {string} type Use types: DeviceFieldUse, DeviceType, DeviceBrand, Device, FileType
 * @member {string} filepath filepath from server if it exist
 * @member {KnowledgeBaseNode[]} children list of children this node has if it exist
 * @member {String[]} ancestors list of ancestor names this node has, must exist if a node is created or updated with API
 * @member {String} parent name of parent, must exist if a node is created or updated with API
 */
  name: string;
  id?: string;
  type: string;
  filepath?: string;
  children?: KnowledgeBaseNode[];
  ancestors?: String[];
  NodeTypes?: KnowledgeBaseNodeTypes;
  parent?: String;

}
