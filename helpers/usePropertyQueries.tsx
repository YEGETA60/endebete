import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPropertiesList } from "../endpoints/properties/list_GET.schema";
import { getProperty } from "../endpoints/properties/get_GET.schema";
import { postCreateProperty } from "../endpoints/properties/create_POST.schema";
import { postUpdateProperty } from "../endpoints/properties/update_POST.schema";
import { postDeleteProperty } from "../endpoints/properties/delete_POST.schema";
import { postCreateInquiry } from "../endpoints/inquiries/create_POST.schema";
import { getSentInquiries } from "../endpoints/inquiries/sent_GET.schema";
import { getReceivedInquiries } from "../endpoints/inquiries/received_GET.schema";
import { postReplyInquiry } from "../endpoints/inquiries/reply_POST.schema";
import { getInquiryMessages } from "../endpoints/inquiries/messages_GET.schema";

export const useProperties = (filters?: { 
  location?: string; 
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string;
  checkOut?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "price_low" | "price_high";
}) => {
  return useQuery({
    queryKey: ["properties", "list", filters],
    queryFn: async () => {
      const res = await getPropertiesList({
        location: filters?.location,
        guests: filters?.guests,
        minPrice: filters?.minPrice,
        maxPrice: filters?.maxPrice,
        checkIn: filters?.checkIn,
        checkOut: filters?.checkOut,
        page: filters?.page,
        limit: filters?.limit,
        sort: filters?.sort,
      } as any);
      return res;
    },
    placeholderData: (prev) => prev,
  });
};

export const useProperty = (id: number | undefined) => {
  return useQuery({
    queryKey: ["properties", "detail", id],
    queryFn: async () => {
      const res = await getProperty({ id: id! });
      return res.property;
    },
    enabled: id !== undefined,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: any) => postCreateProperty(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "list"] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: any) => postUpdateProperty(vars),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties", "list"] });
      queryClient.invalidateQueries({ queryKey: ["properties", "detail", variables.id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: any) => postDeleteProperty(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: any) => postCreateInquiry(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries", "sent"] });
    },
  });
};

export const useSentInquiries = () => {
  return useQuery({
    queryKey: ["inquiries", "sent"],
    queryFn: async () => {
      const res = await getSentInquiries({});
      return res.inquiries;
    },
  });
};

export const useReceivedInquiries = () => {
  return useQuery({
    queryKey: ["inquiries", "received"],
    queryFn: async () => {
      const res = await getReceivedInquiries({});
      return res.inquiries;
    },
  });
};

export const useReplyToInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: any) => postReplyInquiry(vars),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries", "received"] });
      queryClient.invalidateQueries({ queryKey: ["inquiries", "sent"] });
      queryClient.invalidateQueries({ queryKey: ["inquiries", "messages", variables.inquiryId] });
    },
  });
};

export const useInquiryMessages = (inquiryId: number | undefined) => {
  return useQuery({
    queryKey: ["inquiries", "messages", inquiryId],
    queryFn: async () => {
      const res = await getInquiryMessages({ inquiryId: inquiryId! });
      return res;
    },
    enabled: inquiryId !== undefined,
  });
};