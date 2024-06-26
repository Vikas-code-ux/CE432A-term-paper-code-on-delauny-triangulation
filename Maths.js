class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

// Line Types
const LineType = {
    NORMAL: 'normal',
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical'
};

class Edge {
    /**
     * 
     * @param {Point} A 
     * @param {Point} B 
     */
    constructor(A = new Point(), B = new Point()) {
        this.A = A;
        this.B = B;

        this.determineType();
    }

    determineType() {
        // HORIZONTAL_LINE
        // y = 5;
        // k = 0;
        if (this.B.y - this.A.y == 0) {
            this.k = 0;
            this.l = this.A.y;
            this.type = LineType.HORIZONTAL;
        }
        // VERTICAL_LINE
        // x = 5;
        // k = infinity
        else if (this.B.x - this.A.x == 0) {
            this.k = Infinity;
            this.l = this.A.x;
            this.type = LineType.VERTICAL;
        }
        // NORMAL_LINE
        else {
            this.k = (this.B.y - this.A.y) / (this.B.x - this.A.x);
            this.l = this.A.y - (this.k * this.A.x);
            this.type = LineType.NORMAL;
        }

        // Calculate length
        this.length = Math.sqrt(Math.pow(this.B.x - this.A.x, 2) + Math.pow(this.B.y - this.A.y, 2));
    }

    perpendicular_bisector() {
        // Calculate center point sx, sy
        const sx = (this.A.x + this.B.x) / 2;
        const sy = (this.A.y + this.B.y) / 2;

        // perpendicular_bisector
        let perpendicular;

        // HORIZONTAL LINE
        if (this.type == LineType.HORIZONTAL) {
            let A = new Point(sx, sy - this.length / 2);
            let B = new Point(sx, sy + this.length / 2);
            perpendicular = new Edge(A, B);
        }
        // VERTICAL LINE
        else if (this.type == LineType.VERTICAL) {
            let A = new Point(sx - this.length / 2, sy);
            let B = new Point(sx + this.length / 2, sy);
            perpendicular = new Edge(A, B);
        }
        // NORMAL LINE
        else {
            const k2 = -1 / this.k;
            const l2 = sy - (k2 * sx);

            const x2 = sx - this.length / 2;
            const y2 = k2 * x2 + l2;

            const x3 = sx + this.length / 2;
            const y3 = k2 * x3 + l2;

            let A = new Point(x2, y2);
            let B = new Point(x3, y3);
            perpendicular = new Edge(A, B);
        }

        return perpendicular;
    }

    /**
     * 
     * @param {Edge} edge 
     */
    intersection(edge) {

        // The other edge / line
        const rb = edge;

        // Resulting point
        let p = new Point();


        // HORIZONTAL LINE & VERTICAL
        if (this.type == LineType.HORIZONTAL && rb.type == LineType.VERTICAL) {
            p.x = rb.l;
            p.y = this.l;
        }
        // VERTICAL LINE & HORIZONTAL
        else if (this.type == LineType.VERTICAL && rb.type == LineType.HORIZONTAL) {
            p.x = this.l;
            p.y = rb.l;
        }
        // HORIZONTAL & NORMAL
        else if (this.type == LineType.HORIZONTAL && rb.type == LineType.NORMAL) {
            p.y = this.l;
            p.x = (p.y - rb.l) / rb.k;
        }
        // NORMAL & HORIZONTAL
        else if (this.type == LineType.NORMAL && rb.type == LineType.HORIZONTAL) {
            p.y = rb.l;
            p.x = (p.y - this.l) / this.k;
        }
        // VERTICAL & NORMAL
        else if (this.type == LineType.VERTICAL && rb.type == LineType.NORMAL) {
            p.x = this.l;
            p.y = rb.k * p.x + rb.l;
        }
        // NORMAL & VERTICAL
        else if (this.type == LineType.NORMAL && rb.type == LineType.VERTICAL) {
            p.x = rb.l;
            p.y = this.k * p.x + this.l;
        }
        // Both NORMAL LINES
        else if (this.type == LineType.NORMAL && rb.type == LineType.NORMAL) {
            // x = (l2 - l1) / (k1 - k2)
            // y = k1x + l1 || y = k2x + l2
            p.x = (rb.l - this.l) / (this.k - rb.k);
            p.y = this.k * p.x + this.l;
        }
        // HORIZONTAL & HORIZONTAL || VERTICAL & VERTICAL
        else {
            // Error return infinity
            p.x = Infinity;
            p.y = Infinity;

            console.log("Horizontal & Horizontal or Vertical & Vertical operation!\n");
        }

        return p;
    }

    /**
     * 
     * @param {Edge} edge 
     */
    equals(edge) {
        if (this.A == edge.A && this.B == edge.B) {
            return true;
        } else if (this.A == edge.B && this.B == edge.A) {
            return true;
        } else {
            return false;
        }
    }
}

class TriangleMesh {
    constructor() {
        this.badTriangle = false;
        this.containsFromSuper = false;
    }
    /**
     * 
     * @param {Point} A 
     * @param {Point} B 
     * @param {Point} C 
     */
    createFromPoints(A, B, C) {
        this.a = new Edge(A, B);
        this.b = new Edge(B, C);
        this.c = new Edge(C, A);

        this.A = A;
        this.B = B;
        this.C = C;
    }

    /**
     * 
     * @param {Edge} a 
     * @param {Edge} b 
     * @param {Edge} c 
     */
    createFromEdges(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;

        this.A = a.A;
        this.B = b.A;
        this.C = c.A;
    }

    /**
     * 
     * @param {Point} point
     */
    isPointInCircumcircle(point) {
        const circumCenter = this.CircumcircleCenterPoint();
        const radius = this.CircumcircleRadius();

        return Math.sqrt(Math.pow(point.x - circumCenter.x, 2) + Math.pow(point.y - circumCenter.y, 2)) <= radius;
    }

    CircumcircleCenterPoint() {
        const perpendicular_bisector1 = this.a.perpendicular_bisector();
        const perpendicular_bisector2 = this.b.perpendicular_bisector();

        return perpendicular_bisector1.intersection(perpendicular_bisector2);
    }

    CircumcircleRadius() {
        const a = this.a.length;
        const b = this.b.length;
        const c = this.c.length;

        return (a * b * c) / (4 * this.Povrsina());
    }

    Povrsina() {
        const a = this.a.length;
        const b = this.b.length;
        const c = this.c.length;

        const s = (a + b + c) / 2;

        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    draw(colour = 'black') {
        line(this.A.x, this.A.y, this.B.x, this.B.y, colour);
        line(this.B.x, this.B.y, this.C.x, this.C.y, colour);
        line(this.C.x, this.C.y, this.A.x, this.A.y, colour);

        drawFillRect(this.A.x - 2.5, this.A.y - 2.5, 5, 5, 'green');
        drawFillRect(this.B.x - 2.5, this.B.y - 2.5, 5, 5, 'green');
        drawFillRect(this.C.x - 2.5, this.C.y - 2.5, 5, 5, 'green');
    }

    drawFill(colour = 'black', enableStroke = false, strokeColour = 'white', dotColour = 'green') {
        ctx.beginPath();
        ctx.moveTo(this.A.x, this.A.y);
        ctx.lineTo(this.B.x, this.B.y);
        ctx.lineTo(this.C.x, this.C.y);
        ctx.closePath();

        ctx.lineJoin = 'round';

        ctx.fillStyle = colour;
        ctx.fill();
        
        if (enableStroke) {
            ctx.strokeStyle = strokeColour;
            ctx.stroke();
        }

        drawFillRect(this.A.x - 2.5, this.A.y - 2.5, 5, 5, dotColour);
        drawFillRect(this.B.x - 2.5, this.B.y - 2.5, 5, 5, dotColour);
        drawFillRect(this.C.x - 2.5, this.C.y - 2.5, 5, 5, dotColour);
    }

    drawCircumcircle() {
        const center = this.CircumcircleCenterPoint();
        drawFillRect(center.x - 2.5, center.y - 2.5, 5, 5, 'red');

        drawArc(center.x, center.y, this.CircumcircleRadius(), 0, Math.PI * 2, 'cyan', 2);
    }
}