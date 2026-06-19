code : 
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, Signe de\\ $f'(x)$ / 1.5, Variations\\ de $f$ / 2}{$0$, $1$, $+\infty$}
\end{tikzpicture}

issue :
 - the "\\" is rendered as raw text not as Latex line break.
 - I think I doesn't worth fixing it as we online text within "$" are treted as Latex

code #33:
 \begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$0$, $1$, $2$, $+\infty$}
  \tkzTabVar{D-/ $-\infty$ , R/ , R/ , +/ $+\infty$}
\end{tikzpicture}

code #34:
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$a$, $b$, $c$, $d$, $e$}
  \tkzTabVar{-/ $V_a$ , R , R , R , +/ $V_e$}
\end{tikzpicture}

code #35:
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{+/ $0$ , -D+/ $-\infty$ / $+\infty$ , -/ $0$}
\end{tikzpicture}
issue : incorect variation arrow at the first row

code #36:
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$-\infty$, $1$, $+\infty$}
  \tkzTabVar{-/ $-\infty$ , +D-/ $+\infty$ / $-\infty$ , +/ $1$}
\end{tikzpicture}
issue : incorect variation arrow at the last row

code #41 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$-\infty$, $-1$, $1$, $+\infty$}
  \tkzTabVar{+/ $+\infty$ , -H/ $0$ , -/ $0$ , +/ $+\infty$}
\end{tikzpicture}
issue : the arrow is still drawn other the hashed region.

code #42 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$0$, $1$, $2$, $3$}
  \tkzTabVar{-/ $-\infty$ , +H/ $0$ , +C/ $5$ , -/ $0$}
\end{tikzpicture}
issue : the arrow is still drawn other the hashed region.

code #43 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$0$, $1$, $2$, $3$}
  \tkzTabVar{+/ $1$ , -DH/ $-\infty$ / , D+/ / $+\infty$ , -/ $2$}
\end{tikzpicture}
issue :
    - the arrow is still drawn other the hashed region.
    - the D+ doesn't position $+\infty$

code #44 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$-\infty$, $0$, $1$, $+\infty$}
  \tkzTabVar{+/ $1$ , -DH/ $-\infty$ / , -DH/ $V_b$ / $V_{b2}$ , D+/ }
\end{tikzpicture}
issue : the arrow is still drawn other the hashed region.

code #45 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$0$, $1$, $2$, $3$}
  \tkzTabVar{+/ $1$ , -CH/ $-2$ / , D+/ / $+\infty$ , -/ $2$}
\end{tikzpicture}
issue : sign D+ doesn't position label correctly

code #46 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{+/ $0$ , -D+/ $-\infty$ / $+\infty$ , -/ $0$}
\end{tikzpicture}
issue  : first arrow is not correctly positioned

code #47 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$ , +D-/ $+\infty$ / $-\infty$ , +/ $+\infty$}
\end{tikzpicture}
issue  : first arrow is not correctly positioned

code #48 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$a$, $b$, $c$}
  \tkzTabVar{-/ $V_a$ , +CD-/ $V_{b1}$ / $V_{b2}$ , +/ $V_c$}
\end{tikzpicture}
issue  : first arrow is not correctly positioned

code #49 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$a$, $b$, $c$}
  \tkzTabVar{-/ $V_a$ , +DC-/ $V_{b1}$ / $V_{b2}$ , +/ $V_c$}
\end{tikzpicture}
issue  : first arrow is not correctly positioned

code #50 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$a$, $b$, $c$}
  \tkzTabVar{+/ $V_a$ , -V+/ $V_{b1}$ / $V_{b2}$ , -/ $V_c$}
\end{tikzpicture}
issue  : first arrow is not correctly positioned

code #51 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$-\infty$, $1$, $+\infty$}
  \tkzTabVar{-/ $-\infty$ , +V-/ $+\infty$ / $+\infty$ , -/ $1$}
\end{tikzpicture}
issue  : the two arrows are not correctly positioned

code #52 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f''(x)$ / 1, $f'(x)$ / 2, $f(x)$ / 2}{$0$, $1$, $+\infty$}
  \tkzTabLine{d , + , z , - , }
  \tkzTabVar{D-/ $-\infty$ , +/ , -/ $-\infty$}
  \tkzTabVar{+/ $+\infty$ , R/ , -/ $0$}
\end{tikzpicture}
issue : not rendered

code #53 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$0$, $\frac{1}{e}$, $+\infty$}
  \tkzTabVar{D-/ $-\infty$ , -/ $\dfrac{-1}{e}$ , +/ $+\infty$}
\end{tikzpicture}
issue  : first arrow is not correctly positioned

code #55 :
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 2}{$-\infty$, $0$, $+\infty$}
  \tkzTabVar{-/ $-\infty$ , +/ {} , -/ $-\infty$}
\end{tikzpicture}
issue : {} is rendered as is instead of blank

code #57:
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f'(x)$ / 1, $f(x)$ / 2}{$0$, $1$, $2$, $+\infty$}
  \tkzTabLine{d , + , z , + , z , + , }
  \tkzTabVar{D-/ / $-\infty$ , R/ / , R/ / , +/ $+\infty$ /}
\end{tikzpicture}
issue : not rendered

code #58:
\begin{tikzpicture}
  \tkzTabInit{$x$ / 1, $f(x)$ / 3}{$0$, $1/e$, $+\infty$}
  \tkzTabLine{d , - , z , + , }
  \tkzTabVar{D+/ / $0$ , -/ \colorbox{black}{\textcolor{white}{$\frac{-1}{e}$}}/ , +/ $+\infty$ /}
\end{tikzpicture}
issue : crash the app, there is one row in the init but one line and one var,must handle this case correctly.

code #61:
\begin{tikzpicture}
\tkzTabInit{$x$ / 1, $f(x)$ / 2}{$-\infty$, $-1$, $0$, $1$, $+\infty$}
\tkzTabLine{ , - , z , + , z , - , z , + , }
\tkzTabVar{+/ $2$ , -/ $-1$ , +/ $3$ , -/ $0$ , +/ $2$}
\end{tikzpicture}
issue : crash the app, to much line, must handle the number of column correctly

code #61:
\begin{tikzpicture}
\tkzTabInit{$x$ / 1, $f(x)$ / 3}{$a$, $b$, $c$, $d$}
\tkzTabVar{-/ $V_a$ , +CD-/ $V_{b1}$ / $V_{b2}$ , D+/ $V_c$ , -/ $V_d$}
\end{tikzpicture}
issue : first arrow not handled correctly.

code #63:
\begin{tikzpicture}
\tkzTabInit{$x$ / 1, $f'(x)$ / 1, Variations de\\ $\tan$ / 3}{$0$, $\frac{\pi}{2}$, $\pi$}
\tkzTabLine{ , + , d , + , }
\tkzTabVar{-/ $0$ , +D-/ $+\infty$ / $-\infty$ , +/ $0$}
\end{tikzpicture}
issue : issue : first arrow not handled correctly.

code #64
\begin{tikzpicture}
\tkzTabInit{$x$ / 1, $f'(x)$ / 2, $f(x)$ / 2}{$0$, $\sqrt{e}$, $+\infty$}
\tkzTabLine{d , + , 0 , + , }
\tkzTabVar{D-/ $-\infty$ , R/ , +/ $0$}
\tkzTabVar{D-/ $-\infty$ , R/ , +/ $0$}
\end{tikzpicture}
issue : R/ and R modifier not supported