import React, { useState } from "react";
import { Box, Button, Tooltip, Menu } from "@chakra-ui/react";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  return (
    <>
      <Box>
        <Tooltip label="Search Useres to chat" hasArrow placements="bottom-end">
          <Button>
            <FontAwesomeIcon icon={byPrefixAndName.fas["magnifying-glass"]} />
            <Text d={{ base: "none" md: "flex"}}>
                Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontFamily="Plus Jakarta Sans, system-ui, sans-serif">
            Chasty{/*  title */}
        </Text>

        <div>
            <Menu>
                <MenuButton>
                    {/* bellicon */}
                </MenuButton>
            {/* <MenuList></MenuList> */}
            </Menu>
            <Menu>
                <MenuButto as={Button} rightIcon={<ChevronDownIcon/>}>
                    {/* bellicon */}
                </MenuButto>
            </Menu>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
