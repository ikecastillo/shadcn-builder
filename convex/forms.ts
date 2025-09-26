import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveForm = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    components: v.array(v.any()),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const formId = await ctx.db.insert("forms", {
      title: args.title,
      description: args.description,
      components: args.components,
      tags: args.tags,
      category: args.category,
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });

    return formId;
  },
});

export const updateForm = mutation({
  args: {
    id: v.id("forms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    components: v.optional(v.array(v.any())),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const getForm = query({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserForms = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return [];
    }
    
    return await ctx.db
      .query("forms")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getAllForms = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

export const deleteForm = mutation({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
