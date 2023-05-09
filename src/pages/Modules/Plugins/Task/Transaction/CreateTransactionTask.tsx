import { PluginDefinition } from "@aut-labs-private/sdk";
import { Container, Box, Typography } from "@mui/material";

interface PluginParams {
  plugin: PluginDefinition;
}

const CreateTransactionTask = ({ plugin }: PluginParams) => {
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
          CreateJoinDiscord Task
        </Typography>
      </Box>
    </Container>
  );
};

export default CreateTransactionTask;
