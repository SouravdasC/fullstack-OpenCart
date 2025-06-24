import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { GridAddIcon, GridExpandMoreIcon } from '@mui/x-data-grid';
import { ImportExport, PostAdd, ShoppingCart, PeopleAlt, BarChart } from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const DashboardSideBar = () => {
  return (
    <aside className="w-64 bg-gray-900  text-white  p-4 flex flex-col gap-4 shadow-lg relative">
      <main className="relative text-white">
        {/* Logo */}
        <Link
          to="/"
          className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-1"
        >
          <span>Open</span>
          <span className="text-emerald-500">Cart</span>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </Link>

        {/* Navigation */}
        <nav>
          <SimpleTreeView
            defaultCollapseIcon={<GridExpandMoreIcon />}
            defaultExpandIcon={<ImportExport />}
          >
            {/* dashborad */}
            <TreeItem itemId="1" label="Dashboard">
              <TreeItem
                itemId="2"
                label={
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 hover:text-blue-400"
                  >
                    <ShoppingCart fontSize="small" />
                    Dashboard
                  </Link>
                }
              />
            </TreeItem>

            {/* Products */}
            <TreeItem itemId="3" label="Products">
              <TreeItem
                itemId="4"
                label={
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-2 hover:text-blue-400"
                  >
                    <PostAdd fontSize="small" /> All Products
                  </Link>
                }
              />
              <TreeItem
                itemId="5"
                label={
                  <Link
                    to="/admin/product/create"
                    className="flex items-center gap-2 hover:text-blue-400"
                  >
                    <GridAddIcon fontSize="small" /> Create Product
                  </Link>
                }
              />
            </TreeItem>

            {/* Orders */}
            <TreeItem itemId="6" label="Orders">
              <TreeItem
                itemId="7"
                label={
                  <Link to="/admin/orders" className="flex items-center gap-2 hover:text-blue-400">
                    <ShoppingCart fontSize="small" /> All Orders
                  </Link>
                }
              />
            </TreeItem>

            {/* Users */}
            <TreeItem itemId="8" label="Users">
              <TreeItem
                itemId="9"
                label={
                  <Link to="/admin/users" className="flex items-center gap-2 hover:text-blue-400">
                    <PeopleAlt fontSize="small" /> Manage Users
                  </Link>
                }
              />
            </TreeItem>

            {/* Reviews */}
            <TreeItem itemId="10" label="Reviews">
              <TreeItem
                itemId="11"
                label={
                  <Link
                    to="/admin/analytics"
                    className="flex items-center gap-2 hover:text-blue-400"
                  >
                    <BarChart fontSize="small" /> Reviews
                  </Link>
                }
              />
            </TreeItem>
            {/* Reviews */}
            <TreeItem itemId="12" label="Message">
              <TreeItem
                itemId="13"
                label={
                  <Link
                    to="/admin/messages"
                    className="flex items-center gap-2 hover:text-blue-400"
                  >
                    <BarChart fontSize="small" /> Message
                  </Link>
                }
              />
            </TreeItem>
          </SimpleTreeView>
        </nav>
      </main>
    </aside>
  );
};

export default DashboardSideBar;
