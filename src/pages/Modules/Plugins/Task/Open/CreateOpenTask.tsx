import { PluginDefinition } from "@aut-labs/sdk";
import { Container, Box, Typography } from "@mui/material";

interface PluginParams {
  plugin: PluginDefinition;
}

const CreateOpenTasks = ({ plugin }: PluginParams) => {
  return (
    <Container maxWidth="lg" sx={{ py: "20px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative"
        }}
      >
        <Typography textAlign="center" color="white" variant="h3">
          Create tasks
        </Typography>
      </Box>
    </Container>
  );
};

export default CreateOpenTasks;
