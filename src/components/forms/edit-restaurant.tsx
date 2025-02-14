"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  FormControl,
  FormLabel,
  MenuItem,
  //   CircularProgress,
  //   Alert,
  Grid,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { editRestaurant } from "@/actions/actions.admin";
import { editRestaurantSchema, TEditRestaurant } from "@/lib/schema";
import EditIcon from "@mui/icons-material/Edit";
import LoadingButton from "../ui/loading-button";
import { auth } from "@/firebase/firebaseconfig";
import { useToast } from "@/context/toastContext";

interface EditRestaurantProps {
  restaurantId: string;
  initialData: TEditRestaurant;
  iconTrigger?: boolean
}

export default function EditRestaurant({
  restaurantId,
  initialData,
  iconTrigger
}: EditRestaurantProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm<TEditRestaurant>({
    resolver: zodResolver(editRestaurantSchema),
    defaultValues: initialData,
  });

  const {showToast} = useToast(); 
  const {
    mutate,
    isPending,
    // isError,
    // error,
  } = useMutation({
    mutationFn: async (data: TEditRestaurant) => {
      console.log("Editing restaurant with data", data);
      const user = auth.currentUser; 
      if(!user){
        throw new Error("User not found"); 
      }
      const idToken = await user.getIdToken(true);
      console.log("User role and claims ",await user.getIdTokenResult());
      return await editRestaurant(restaurantId as string, data, idToken);
    },
    onSuccess: (response) => {
      // add a toaster here later
      if(response.success){
        showToast("Restaurant updated successfully", "success");
      }
      else {
        showToast(response.error || "Failed to update restaurant", "error");
      }
    },
  });

  const handleOpen = () => {
    console.log("Opening dialog...");
    setOpen(true);
  };

  const onSubmit = (data: TEditRestaurant) => {
    // updateRestaurant(data);
    console.log("Submitting data", data);
    mutate(data);
  };

  return (
    <>
      {iconTrigger ? <IconButton size="small" color="primary" onClick={handleOpen}>
        <EditIcon fontSize="small" />
      </IconButton> : <Button
        type="button"
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={handleOpen}
      >
        Edit Details
      </Button>}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(17, 25, 40, 0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
            "& .MuiFormLabel-root": {
              color: "rgba(255, 255, 255, 0.7)",
            },
            "& .MuiInputBase-root": {
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "& .MuiMenuItem-root": {
              color: "white",
            },
          },
        }}
      >
        <DialogTitle
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          Edit Restaurant
        </DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit, (error) => {
            console.log(error);
          })}
          className="space-y-4 mt-2"
        >
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Full width name field */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <FormLabel>Restaurant Name</FormLabel>
                  <TextField
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size="small"
                  />
                </FormControl>
              </Grid>

              {/* Left Column */}
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <FormLabel>Cuisine</FormLabel>
                  <TextField
                    {...register("cuisine")}
                    error={!!errors.cuisine}
                    helperText={errors.cuisine?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Phone</FormLabel>
                  <TextField
                    {...register("contact.phone")}
                    error={!!errors.contact?.phone}
                    helperText={errors.contact?.phone?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    {...register("contact.email")}
                    error={!!errors.contact?.email}
                    helperText={errors.contact?.email?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Status</FormLabel>
                  <TextField
                    {...register("status")}
                    select
                    defaultValue="active"
                    size="small"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              {/* Right Column - Location Fields */}
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <FormLabel>Street Address</FormLabel>
                  <TextField
                    {...register("location.address")}
                    error={!!errors.location?.address}
                    helperText={errors.location?.address?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>City</FormLabel>
                  <TextField
                    {...register("location.city")}
                    error={!!errors.location?.city}
                    helperText={errors.location?.city?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>State</FormLabel>
                  <TextField
                    {...register("location.state")}
                    error={!!errors.location?.state}
                    helperText={errors.location?.state?.message}
                    size="small"
                  />
                </FormControl>

                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <FormLabel>Country</FormLabel>
                  <TextField
                    {...register("location.country")}
                    error={!!errors.location?.country}
                    helperText={errors.location?.country?.message}
                    size="small"
                  />
                </FormControl>
              </Grid>
            </Grid>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                size="small"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                // fullWidth
                size="small"
                variant="contained"
                isLoading={isPending}
                loadingText="Signing In"
              // sx={{}}
              >
                Save Changes
              </LoadingButton>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
