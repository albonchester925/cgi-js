use CGI;
$query = new CGI;
print $query->h3('This is a headline.');
print $query->p('This is body text.');