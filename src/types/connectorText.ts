// Stub: connectorText types (CONNECTOR_TEXT feature-gated)
export interface ConnectorTextBlock {
  type: 'connector_text'
  text: string
}

export function isConnectorTextBlock(block: any): block is ConnectorTextBlock {
  return block?.type === 'connector_text'
}
