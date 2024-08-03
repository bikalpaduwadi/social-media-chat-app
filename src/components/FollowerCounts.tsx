"use client";

import React from "react";

import { FollowerInfo } from "@/types/user";
import { formatNumber } from "@/utils/misc";
import { useFollowerInfo } from "@/hooks/useFollowerInfo";

interface FollowerCountsProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCounts = ({ userId, initialState }: FollowerCountsProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
};

export default FollowerCounts;
