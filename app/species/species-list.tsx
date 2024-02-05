"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { useEffect, useState } from "react";
import AddSpeciesDialog from "./add-species-dialog";
import type { Species } from "./page";
import SpeciesCard from "./species-card";

const kingdoms = ["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"];

export default function SpeciesListChild({ sessionId, species }: { sessionId: string; species: Species[] }) {
  const [speciesData, setSpeciesData] = useState<Species[]>(species);
  const [sort, setSort] = useState<string>("Default");
  const [filter, setFilter] = useState<string>("");
  const [kingdom, setKingdom] = useState<string>("None");

  // sort any species data depending on selected type
  const sortHelper = (data: Species[], type: string): Species[] => {
    const sortFn = (species1: Species, species2: Species): number => {
      if (species1.scientific_name < species2.scientific_name) return -1;
      return 1;
    };

    let sorted;
    if (type === "Default") {
      sorted = data.toSorted((species1, species2) => (species1.id > species2.id ? -1 : 1));
    } else if (type === "A-Z") {
      sorted = data.toSorted(sortFn);
    } else {
      sorted = data.toSorted((a, b) => -1 * sortFn(a, b));
    }

    return sorted;
  };

  // filter and sort whenever new option chosen
  useEffect(() => {
    const filterVal = filter.toLowerCase();
    console.log(filterVal);
    const filteredData = species.filter(
      (species) =>
        (species.common_name?.toLowerCase().includes(filterVal) ||
        species.scientific_name?.toLowerCase().includes(filterVal) ||
        species.description?.toLowerCase().includes(filterVal))
    );

    const filterByKingdom =
      kingdom === "None" ? filteredData : filteredData?.filter((species) => species.kingdom === kingdom);

    const sortedData = sortHelper(filterByKingdom, sort);
    setSpeciesData(sortedData);
  }, [sort, kingdom, filter, species]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog userId={sessionId} />
      </div>
      <Separator className="my-4" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        {/* search value input */}
        <Input placeholder="Search" className="w-full" value={filter} onChange={(e) => setFilter(e.target.value)} />
        {/* kingdom filtering dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8">
              Filter by Kingdom: {kingdom}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setKingdom("None")}>
                  None
                </Button>
              </DropdownMenuItem>
              {kingdoms.map((kingdom) => (
                <DropdownMenuItem key={kingdom}>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setKingdom(kingdom)}>
                    {kingdom}
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
        {/* sorting dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8">
              Sort: {sort}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setSort("Default")}>
                  Default
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setSort("A-Z")}>
                  A-Z
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setSort("Z-A")}>
                  Z-A
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {speciesData?.map((species) => <SpeciesCard userId={sessionId} key={species.id} species={species} />)}
      </div>
    </>
  );
}
