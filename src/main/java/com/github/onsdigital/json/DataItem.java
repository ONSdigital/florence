package com.github.onsdigital.json;

import com.github.onsdigital.json.taxonomy.TaxonomyHome;

import java.net.URI;
import java.util.List;

/**
 * The minimal fields required by the data about every item on the website.
 *
 * @author david
 *
 */
public class DataItem {

    /** Identifies what content type this is. */
    public ContentType type;

    /** The display name of this item. */
    public String name;

    /** The URI of this item. */
    public URI uri;

    /**
     * The name of the folder that represents this item. This is effectively a
     * relative URL to reach this item from the parent.
     */
    public String fileName;

    public List<TaxonomyHome> breadcrumb;

    @Override
    public int hashCode() {
        int result = 0;
        if (uri != null) {
            result = uri.hashCode();
        }
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        boolean result = false;
        if (uri != null && obj != null && DataItem.class.isAssignableFrom(obj.getClass())) {
            result = uri.equals(((DataItem) obj).uri);
        } else {
            // Fall back to instance comparison:
            result = super.equals(obj);
        }
        return result;
    }

    @Override
    public String toString() {
        if (name != null) {
            return name;
        }
        if (uri != null) {
            return uri.toString();
        }
        if (type != null) {
            return type.toString();
        }
        return super.toString();
    }

}

