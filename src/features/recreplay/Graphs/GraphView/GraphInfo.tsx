import { Text } from "@mantine/core";

export function GraphInfo(props: any) {
  const { graph } = props;
  if (!graph) {
    return null;
  }
  return (
    <Text>
      Vertices: {(graph.nodes || []).length} Edges: {(graph.edges || []).length}{" "}
    </Text>
  );
}
