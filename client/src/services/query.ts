import { useQuery } from "@tanstack/react-query"
import { getAllMyAddressApiHandler } from "./api"

const useGetAllMyAddressQuery= (searchQuery:string,token:string)=>{
    return useQuery({
        queryKey: ['getAllMyAddress', searchQuery],
        queryFn: async () => getAllMyAddressApiHandler(searchQuery,token),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60, 
    })
}

export {
    useGetAllMyAddressQuery
}