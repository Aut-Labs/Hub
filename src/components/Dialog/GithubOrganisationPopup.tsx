import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  styled,
  useTheme,
  useMediaQuery,
  SvgIcon,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PerfectScrollbar from "react-perfect-scrollbar";
import CloseIcon from "@assets/autos/close-icon.svg?react";
import { AutOsButton } from "@components/AutButton";

const AutStyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiPaper-root": {
    margin: "0",
    width: "620px",
    height: "720px",
    border: "none",
    position: "relative",
    flexDirection: "column-reverse",
    backgroundColor: "#1E2430",
    borderRadius: "30px",
    padding: "30px 0px",
    boxShadow:
      "0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)"
  },
  [theme.breakpoints.down("md")]: {
    ".MuiPaper-root": {
      margin: "0",
      height: "100%",
      width: "100%",
      border: "none",
      borderRadius: "0",
      boxShadow: "none"
    }
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  ".MuiSelect-select": {
    fontSize: "16px",
    color: theme.palette.offWhite.main,
    padding: "12px 16px"
  },
  ".MuiOutlinedInput-notchedOutline": {
    border: "1.5px solid #576176 !important",
    borderRadius: "6px"
  },
  "&.MuiOutlinedInput-root": {
    backgroundColor: "#2F3746",
    borderRadius: "6px"
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.offWhite.main
  }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  [theme.breakpoints.down("md")]: {
    width: `calc(100% - 100px)`
  },
  [theme.breakpoints.down("sm")]: {
    width: `calc(100% - 20px)`
  }
}));

interface GitHubOrg {
  id: number;
  login: string;
  name: string;
}

interface GitHubOrgDialogProps {
  open: boolean;
  onClose: () => void;
  organizations: GitHubOrg[];
  hub: any;
  onChange: (value: string) => void;
  setValue: (field: string, value: any) => void;
  index: number;
}

const GitHubOrgSelectionDialog = ({
  open,
  onClose,
  organizations,
  hub,
  onChange,
  setValue,
  index
}: GitHubOrgDialogProps) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      organization: ""
    }
  });

  const handleOrgSelection = async (data: { organization: string }) => {
    setLoading(true);
    try {
      const selectedOrg = organizations.find(
        (org) => org.login === data.organization
      );

      if (selectedOrg) {
        // Update the social link metadata similar to Discord dialog
        for (let i = 0; i < hub.properties.socials.length; i++) {
          const element = hub.properties.socials[i];
          if (element.type === "github") {
            element.metadata = {
              orgId: selectedOrg.id,
              orgName: selectedOrg.name,
              orgLogin: selectedOrg.login
            };
          }
        }
        // eslint-disable-next-line no-debugger
        debugger;
        onChange(selectedOrg.login);
        setValue(`socials.${index}.metadata`, {
          orgId: selectedOrg.id,
          orgName: selectedOrg.name,
          orgLogin: selectedOrg.login
        });

        onClose();
      }
    } catch (error) {
      console.error("Error selecting organization:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AutStyledDialog
      fullScreen={!desktop}
      maxWidth={false}
      onClose={onClose}
      open={open}
    >
      <DialogContent
        sx={{
          border: 0,
          padding: "20px 30px"
        }}
      >
        <PerfectScrollbar
          style={{
            height: "calc(100%)",
            display: "flex",
            flexDirection: "column",
            width: "100%"
          }}
        >
          <FormWrapper onSubmit={handleSubmit(handleOrgSelection)}>
            <Typography variant="subtitle1" color="offWhite.main" mb={2}>
              Select GitHub Organization
            </Typography>
            <Typography variant="body2" color="offWhite.main" mb={4}>
              Choose an organization to connect with your hub.
            </Typography>
            <Controller
              name="organization"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <FormControl fullWidth>
                  <StyledSelect
                    value={value}
                    onChange={onChange}
                    disabled={loading}
                  >
                    {organizations.map((org) => (
                      <MenuItem key={org.id} value={org.login}>
                        {org.name || org.login}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              )}
            />
          </FormWrapper>
        </PerfectScrollbar>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 30px",
          mt: {
            xs: "64px",
            md: "0"
          }
        }}
      >
        <Box
          sx={{
            width: {
              xs: "17%",
              md: "33%"
            }
          }}
        >
          <SvgIcon
            onClick={onClose}
            sx={{
              fill: "transparent",
              height: "30px",
              width: "30px",
              cursor: "pointer"
            }}
            component={CloseIcon}
          />
        </Box>
        <Box
          sx={{
            width: {
              xs: "50%",
              md: "33%"
            },
            justifyContent: "center",
            display: "flex"
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={{
              xs: "14px",
              md: "20px"
            }}
            color="offWhite.main"
            fontWeight="bold"
          >
            Select Organization
          </Typography>
        </Box>
        <Box
          sx={{
            width: "33%",
            justifyContent: "flex-end",
            display: "flex"
          }}
        >
          <AutOsButton
            onClick={handleSubmit(handleOrgSelection)}
            type="submit"
            color="primary"
            variant="outlined"
            disabled={!formState.isValid || loading}
            sx={{
              width: "100px"
            }}
          >
            <Typography fontWeight="bold" fontSize="16px" lineHeight="26px">
              {loading ? "Saving..." : "Save"}
            </Typography>
          </AutOsButton>
        </Box>
      </DialogActions>
    </AutStyledDialog>
  );
};

export default GitHubOrgSelectionDialog;
