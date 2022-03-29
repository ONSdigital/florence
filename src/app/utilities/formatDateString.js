import React from "react";

export function formatDateString(date) {
    const utcDate = new Date(date);
    const datePart = utcDate.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const timePart = utcDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return (
        <span>
            Created <strong>{`${datePart} at ${timePart}`}</strong>
        </span>
    );
}
