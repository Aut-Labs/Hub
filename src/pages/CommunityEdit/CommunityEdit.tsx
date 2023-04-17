import { updateCommunity } from "@api/community.api";
import { Community } from "@api/community.model";
import { ipfsCIDToHttpUrl } from "@api/storage.api";
import { AutButton } from "@components/buttons";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { AutTextField, FormHelperText } from "@components/Fields";
import AFileUpload from "@components/FileUpload";
import { styled } from "@mui/material";
import {
  CommunityData,
  CommunityStatus,
  communityUpdateState
} from "@store/Community/community.reducer";
import { ResultState } from "@store/result-status";
import { useAppDispatch } from "@store/store.model";
import { countWords } from "@utils/helpers";
import { pxToRem } from "@utils/text-size";
import { toBase64 } from "@utils/to-base-64";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const errorTypes = {
  maxWords: `Words cannot be more than 3`,
  maxLength: `Characters cannot be more than 280`
};

const StepWrapper = styled("form")({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  height: "100%"
});

const CommunityEdit = () => {
  const dispatch = useAppDispatch();
  const community = useSelector(CommunityData);
  const status = useSelector(CommunityStatus);
  const [promises, setPromises] = useState([]);
  const { control, handleSubmit, formState, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      name: community.name,
      image: community.image,
      description: community.description
    }
  });

  const onSubmit = async (data: typeof community) => {
    const promise = dispatch(
      updateCommunity(
        new Community({
          ...community,
          ...data
        })
      )
    );
    setPromises([promise]);
  };

  const handleDialogClose = () => {
    dispatch(
      communityUpdateState({
        status: ResultState.Idle
      })
    );
  };

  useEffect(() => {
    reset({
      name: community.name,
      image: community.image,
      description: community.description
    });
  }, [dispatch, community?.properties?.address]);

  useEffect(() => {
    return () => {
      promises.forEach((p) => p.abort());
    };
  }, [dispatch, promises]);

  return (
    <StepWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <ErrorDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message="Something went wrong"
      />
      <LoadingDialog
        handleClose={handleDialogClose}
        open={status === ResultState.Updating}
        message="Updating community..."
      />
      <Controller
        name="image"
        control={control}
        render={({ field: { onChange } }) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <AFileUpload
                initialPreviewUrl={ipfsCIDToHttpUrl(community.image as string)}
                color="offWhite"
                fileChange={async (file) => {
                  if (file) {
                    onChange(await toBase64(file));
                  } else {
                    onChange(null);
                  }
                }}
              />
            </div>
          );
        }}
      />
      <Controller
        name="name"
        control={control}
        rules={{
          required: true,
          validate: {
            maxWords: (v: string) => countWords(v) <= 3
          }
        }}
        render={({ field: { name, value, onChange } }) => {
          return (
            <AutTextField
              width="450"
              variant="standard"
              required
              autoFocus
              name={name}
              value={value || ""}
              onChange={onChange}
              placeholder="Community Name"
              sx={{
                mt: pxToRem(45)
              }}
              helperText={
                <FormHelperText
                  errorTypes={errorTypes}
                  value={value}
                  name={name}
                  errors={formState.errors}
                >
                  <span>{3 - countWords(value)} Words left</span>
                </FormHelperText>
              }
            />
          );
        }}
      />

      <Controller
        name="description"
        control={control}
        rules={{ maxLength: 280 }}
        render={({ field: { name, value, onChange } }) => {
          return (
            <AutTextField
              width="450"
              name={name}
              value={value || ""}
              onChange={onChange}
              color="primary"
              multiline
              rows={5}
              sx={{
                mt: pxToRem(45)
              }}
              placeholder="Introduce your community to the world. It can be a one-liner, common values, goals, or even the story behind it!"
              helperText={
                <FormHelperText
                  errorTypes={errorTypes}
                  value={value}
                  name={name}
                  errors={formState.errors}
                >
                  <span>Max characters {280 - (value?.length || 0)}</span>
                </FormHelperText>
              }
            />
          );
        }}
      />
      <AutButton
        disabled={!formState.isValid}
        sx={{
          minWidth: pxToRem(325),
          maxWidth: pxToRem(325),
          height: pxToRem(70),
          mt: pxToRem(100)
        }}
        type="submit"
        color="primary"
        variant="outlined"
      >
        Save
      </AutButton>
    </StepWrapper>
  );
};

export default CommunityEdit;
