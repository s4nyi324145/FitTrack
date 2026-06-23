"use client";

import React from "react";

const NotesField = () => {
  return (
    <textarea
      placeholder="Add workout notes..."
      className=" p-2   w-full rounded-btn border border-border bg-surface-raised px-3 text-md text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
    ></textarea>
  );
};

export default NotesField;
