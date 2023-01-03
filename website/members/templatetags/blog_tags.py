from __future__ import annotations

from django import template

from website.blog.models import BlogPage

register = template.Library()


@register.inclusion_tag("tags/blog_authors.html")
def blog_authors(post):
    return {"authors": post.authors.all()}
